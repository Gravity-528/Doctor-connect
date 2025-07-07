import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../Providers/Socket';
import { usePeer } from '../Providers/WebRTC';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useData } from '../Providers/DataProvider';
import axios from 'axios';

const DoctorVideo = () => {
   const {total}=useParams();
   console.log("total is",total);
   const username=total.split("+")[0];
   const time=total.split("+")[1];

   // console.log("time frontend is",time);
   // console.log("username frontend is",username);

   const navigate=useNavigate();
//    const peer=new RTCPeerConnection({
//       iceServers:[
//           {urls:'stun:stun.l.google.com:19302'}
//       ]
//   })

   const {peer, SendOffer, RecieveAnswer, getCam } = usePeer();
   // const {userById}=useData();
   const [doctorBhai,setDoctorBhai]=useState();
   const [doctorId,setDoctorId]=useState();
   const [slotid,setSlotId]=useState();
   const [userId,setUserId]=useState();
   

   // const GetDoctor=async()=>{
   //    try{
   //       const response=await axios.get("/api/v1/doctor/doctorBhai",{withCredentials:true});
   //       setDoctorBhai(response.data.data);
   //       setDoctorId(response.data.data._id);
   //       console.log("doctor response is---------------------------",response.data.data._id);
   //       socket.emit("register",{you:response.data.data.username});
   //    }catch(error){
   //       console.log("error in getting doctorid at doctorvideo",err);
   //    }
   // }
   // const askForSlot=async()=>{
   //    try{
   //       console.log("doctorId is......................",doctorId);
   //    const response=await axios.post("/api/v1/Slot/askSlotId",{time,doctorId:doctorBhai._id},{withCredentials:true});
   //    console.log("slotFront-----------------------------------------",response);
   //    setSlotId(response.data.data);
   //    }catch(err){
   //       console.error("error in frontend fetching slotId",err);
   //    }
   // }
   // const findUserByUsername=async()=>{
   //    try {
   //       const response=await axios.post("/api/v1/user/userUsername",{username},{withCredentials:true});
   //       console.log("userFrontend----------------------------------------",response);
   //       setUserId(response.data.data);

   //    } catch (error) {
   //       console.error("error in getting userId in frontend",err);
   //    }
   // }
   const UnBookSlot=async()=>{
      try {
         console.log("useris-----------------------",userId,slotid);
         const response=await axios.post("/api/v1/Slot/unBookSlot",{slotid,userId},{withCredentials:true});
         console.log("unbook slot response is----------------------------------------",response);
      } catch (error) {
         console.error("some error is here is unBooking the Slot frontend",error);
      }

   }
   
   const socket = useSocket();
   
   
   // console.log("peer is",peer);
   const localVideoRef = useRef();
   const remoteVideoRef = useRef();
   const localStreamRef=useRef();
   const remoteStreamRef=useRef();

   const [localStream, setLocalStream] = useState(null);
   const [remoteStream, setRemoteStream] = useState(null);

   const SendLocalStream = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      setLocalStream(stream);
      localStreamRef.current=stream;
      if (localVideoRef.current) {
         localVideoRef.current.srcObject = stream;
      }
      peer.addStream(stream);
   };

   const SendMessage = async () => {
      // console.log("start button is triggered")
      const offer = await SendOffer();
      // console.log("offer is",offer);
      socket.emit('message', { type: 'create-Offer', sdp: offer,you:doctorBhai.username,other:username });
      setTimeout(()=>{
          socket.emit('message',{type:'disconnect-peer',you:doctorBhai.username,other:username});
          peer.close();
         //  console.log(localStream);
         //  console.log(remoteStream);
          
          if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop()); 
            localVideoRef.current.srcObject = null;  
            setLocalStream(null);}  
          if (remoteStreamRef.current) {
            remoteStreamRef.current.getTracks().forEach(track => track.stop());  
            remoteVideoRef.current.srcObject = null;  
            setRemoteStream(null);  
         }

          UnBookSlot();

          navigate('/DoctorHome')
      },40*60*1000);
   };

   const GetMessage = async (data) => {
      await peer.setRemoteDescription(data);
      // const answer = await RecieveAnswer();
      const answer=await peer.createAnswer();
      peer.setLocalDescription(answer);
        
      // console.log(peer.RemoteDescription)
      socket.emit('message', { type: 'create-answer', sdp: answer,you:doctorBhai.username,other:username });
   };

   const GetAnswer = async (data) => {
      peer.setRemoteDescription(data);
   };

   const ReceiveVideo = (event) => {
      if (!remoteStream) {
         setRemoteStream(event.streams[0]);
         remoteStreamRef.current=event.streams[0];
         if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
         }
      }
   };
   

   useEffect(() => {
      const fetchData=async()=>{
      try{
         const response=await axios.get("/api/v1/doctor/doctorBhai",{withCredentials:true});
         setDoctorBhai(response.data.data);
         setDoctorId(response.data.data._id);
         console.log("doctor response is---------------------------",response.data.data._id);
         socket.emit("register",{you:response.data.data.username});
         console.log("doctorId is......................",doctorId);


         const slotId=await axios.post("/api/v1/Slot/askSlotId",{time,doctorId:response.data.data._id},{withCredentials:true});
         console.log("slotFront-----------------------------------------",slotId.data.data[0]);
         setSlotId(slotId.data.data[0]._id);

         const response3=await axios.post("/api/v1/user/userUsername",{username},{withCredentials:true});
         console.log("userFrontend----------------------------------------",response3.data.data[0]);
         setUserId(response3.data.data[0]._id);


      }catch(err){
         console.error("some error in fetching datas",err);
      }
   }
   fetchData();
      // console.log("doctorId is@@@@",doctorBhai);
   }, []);

   useEffect(() => {
      // GetDoctor();
      
      
      // console.log("slotid is----------------------------",slotid);
      // console.log("userId is------------------------------------",userId);
      // console.log("doctorId is------------------------------------------",doctorId);

      peer.onnegotiationneeded = async () => {
         // console.log("start button is triggered")
         const offer = await SendOffer();
         // console.log("offer is",offer);
         socket.emit('message', { type: 'create-Offer', sdp: offer,you:doctorBhai.username,other:username });
      };
      socket.on('create-offer',async (data) => {
         // console.log("data for create offer",data.sdp);
         await peer.setRemoteDescription(data.sdp);
         // const answer = await RecieveAnswer();
         const answer=await peer.createAnswer();
         await peer.setLocalDescription(answer);
           
         // console.log(peer.RemoteDescription)
         socket.emit('message', { type: 'create-answer', sdp: answer,you:doctorBhai.username,other:username });
      } );
      socket.on('create-answer',async (data) => {
         // console.log("data for create answer",data.sdp);
         await peer.setRemoteDescription(data);
      } );

      SendLocalStream();

      peer.ontrack = ReceiveVideo;
      
      peer.onicecandidate = (event) => {
         if (event.candidate) {
            socket.emit("message", {type:"candidate", sdp: event.candidate, you: doctorBhai?.username, other: username });
         }
      };

      socket.on("candidate", (data) => {
         // console.log("data for candidate",data);
         peer.addIceCandidate(new RTCIceCandidate(data))
            .catch(err => console.error("Error adding received ICE candidate", err));
      });
      socket.on("disconnect-peer",()=>{
         peer.close();
         socket.off('create-offer', GetMessage);
         socket.off('create-answer', GetAnswer);
         if (localStream) {
            localStream.getTracks().forEach(track => track.stop()); 
            localVideoRef.current.srcObject = null;  
            setLocalStream(null);  }
         if (remoteStream) {
            remoteStream.getTracks().forEach(track => track.stop());  
            remoteVideoRef.current.srcObject = null;  
            setRemoteStream(null);  
         }
         navigate('/DoctorHome')
      })
      return () => {
         socket.off('create-offer', GetMessage);
         socket.off('create-answer', GetAnswer);
      };
   }, []);
   

   // console.log("final peer is",peer);
   return (
      <div className="bg-gray-800 h-screen flex flex-col justify-center items-center text-white">
         <h1 className="text-4xl font-bold mb-6">Video Chat</h1>
         <p className="text-lg mb-8">Connect and start your video call!</p>
         
         <div className="flex space-x-8">
            <video ref={localVideoRef} autoPlay muted className="w-72 h-40 bg-gray-700 rounded-md border border-white" />
            <video ref={remoteVideoRef} autoPlay className="w-72 h-40 bg-gray-700 rounded-md border border-white" />
         </div>
         
         <div className="flex space-x-4 mt-8">
            <button onClick={SendMessage} className="bg-blue-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-600 transition duration-300 ease-in-out">
               Start Call
            </button>
         </div>
      </div>
   );
};

export default DoctorVideo;

