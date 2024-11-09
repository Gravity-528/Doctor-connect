import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../Providers/Socket';
import { usePeer } from '../Providers/WebRTC';
import { useParams } from 'react-router-dom';
import { useData } from '../Providers/DataProvider';
import axios from 'axios';

const DoctorVideo = () => {
   const {username}=useParams();
   const { peer, SendOffer, RecieveAnswer, getCam } = usePeer();
   // const {userById}=useData();
   const [doctorBhai,setDoctorBhai]=useState();
   
   const socket = useSocket();
   const GetDoctor=async()=>{
      try{
         const response=await axios.get("http://localhost:8000/api/v1/doctor/doctorBhai",{withCredentials:true});
         setDoctorBhai(response.data.data);
         console.log(response.data.data);
         socket.emit("register",{you:response.data.data.username});
      }catch(error){
         console.log("error in getting doctorid at doctorvideo",err);
      }
   }
   
   console.log("peer is",peer);
   const localVideoRef = useRef();
   const remoteVideoRef = useRef();

   const [localStream, setLocalStream] = useState(null);
   const [remoteStream, setRemoteStream] = useState(null);

   const SendLocalStream = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      setLocalStream(stream);

      if (localVideoRef.current) {
         localVideoRef.current.srcObject = stream;
      }
      peer.addStream(stream);
   };

   const SendMessage = async () => {
      console.log("start button is triggered")
      const offer = await SendOffer();
      console.log("offer is",offer);
      socket.emit('message', { type: 'create-Offer', sdp: offer,you:doctorBhai.username,other:username });
      setTimeout(()=>{
          socket.emit('message',{type:'disconnect-peer',you:doctorBhai.username,other:username});
      },40*60*1000);
   };

   const GetMessage = async (data) => {
      await peer.setRemoteDescription(data);
      // const answer = await RecieveAnswer();
      const answer=await peer.createAnswer();
      peer.setLocalDescription(answer);
        
      console.log(peer.RemoteDescription)
      socket.emit('message', { type: 'create-answer', sdp: answer,you:doctorBhai.username,other:username });
   };

   const GetAnswer = async (data) => {
      peer.setRemoteDescription(data);
   };

   const ReceiveVideo = (event) => {
      if (!remoteStream) {
         setRemoteStream(event.streams[0]);
         if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
         }
      }
   };
   
   useEffect(() => {
      GetDoctor();
      peer.onnegotiationneeded = async () => {
         console.log("start button is triggered")
         const offer = await SendOffer();
         console.log("offer is",offer);
         socket.emit('message', { type: 'create-Offer', sdp: offer,you:doctorBhai.username,other:username });
      };
      socket.on('create-offer',async (data) => {
         console.log("data for create offer",data.sdp);
         await peer.setRemoteDescription(data.sdp);
         // const answer = await RecieveAnswer();
         const answer=await peer.createAnswer();
         await peer.setLocalDescription(answer);
           
         console.log(peer.RemoteDescription)
         socket.emit('message', { type: 'create-answer', sdp: answer,you:doctorBhai.username,other:username });
      } );
      socket.on('create-answer',async (data) => {
         console.log("data for create answer",data.sdp);
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
         console.log("data for candidate",data);
         peer.addIceCandidate(new RTCIceCandidate(data))
            .catch(err => console.error("Error adding received ICE candidate", err));
      });
      socket.on("disconnect-peer",()=>{
         peer.close();
      })
      return () => {
         socket.off('create-offer', GetMessage);
         socket.off('create-answer', GetAnswer);
      };
   }, []);
   console.log("final peer is",peer);
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
