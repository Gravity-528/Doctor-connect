import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../Providers/Socket';
import { usePeer } from '../Providers/WebRTC';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useData } from '../Providers/DataProvider';

const Video = () => {
   const navigate=useNavigate();
   const {isAuth}=useData();
   const {username}=useParams();
   console.log("username route is",username);
   // const {userById}=useData();
   const [userById,setUserById]=useState([]);
   console.log("isAuth is",isAuth);
   const socket = useSocket();
   console.log("your socket is",socket);
   
   const GetUserId=async()=>{
      try {
          const response=await axios.get('/api/v1/user/fetchById',{withCredentials:true});
          console.log(response);
          setUserById(response.data.data.username);
          
      } catch (error) {
          console.error("some frontend error in fetching userById",error);
      }
  }
   
   const { peer, SendOffer, RecieveAnswer, getCam } = usePeer();
   
   

   const localVideoRef = useRef();
   const remoteVideoRef = useRef();
   const localStreamRef=useRef();
   const remoteStreamRef=useRef();

   const [localStream, setLocalStream] = useState(null);
   const [remoteStream, setRemoteStream] = useState(null);

   const SendLocalStream = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      setLocalStream(stream);
      localStreamRef.current = stream;
      if (localVideoRef.current) {
         localVideoRef.current.srcObject = stream;
      }
      peer.addStream(stream);
   };

   const SendMessage = async () => {
      const offer = await SendOffer();
      socket.emit('message', { type: 'create-Offer', sdp: offer,you:userById,other:username });

   //    setTimeout(()=>{
   //       socket.emit('message',{type:'disconnect-peer',you:userById,other:username});
   //       peer.close();
   //       navigate('/UserHome')
   //   },40*1000);
   };

   const GetMessage = async (data) => {
      await peer.setRemoteDescription(data);
      const answer = await RecieveAnswer();
      socket.emit('message', { type: 'create-answer', sdp: answer,you:userById,other:username });
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
   useEffect(()=>{
      socket.emit("register",{you:userById});
   },[userById])

   useEffect(() => {

      GetUserId();
      peer.onnegotiationneeded = async () => {
         const offer = await SendOffer();
         socket.emit('message', { type: 'create-Offer', sdp: offer,you:userById,other:username });
      };;
      socket.on('create-offer', async (data) => {
         console.log(data);
         const {}=data;
         await peer.setRemoteDescription(data);
         const answer = await RecieveAnswer();
         socket.emit('message', { type: 'create-answer', sdp: answer,you:userById,other:username });
      });
      socket.on('create-answer', async (data) => {
         await peer.setRemoteDescription(data);
      });
      
      SendLocalStream();

      peer.ontrack = ReceiveVideo;
      peer.onicecandidate = (event) => {
         if (event.candidate) {
            socket.emit("message", {type:"candidate", sdp: event.candidate, you: userById, other: username });
         }
      };

      socket.on("candidate", (data) => {
         peer.addIceCandidate(new RTCIceCandidate(data.sdp))
            .catch(err => console.error("Error adding received ICE candidate", err));
      });
      console.log("extra prev localStream",localStream);
      console.log("extra prev remoteStream",remoteStream);

      socket.on("disconnect-peer",()=>{

         console.log("userSocket is disconnecting for socket25sec");
         console.log("prev localStreamRef",localStreamRef.current);
          if (localStreamRef.current) {
            // localStream.getTracks().forEach(track => track.stop()); 
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localVideoRef.current.srcObject = null;
            localStreamRef.current = null;
            
            console.log("prev localRef is",localVideoRef.current.srcObject);
            setLocalStream(null);
         
         } 

            console.log("prev remoteStreamRef",remoteStreamRef.current); 
          if (remoteStreamRef.current) {
            remoteStreamRef.current.getTracks().forEach(track => track.stop());  
            remoteVideoRef.current.srcObject = null;
            remoteStreamRef.current=null;
            console.log("prev remoteRef is",remoteVideoRef.current.srcObject);
            setRemoteStream(null);  
         }

         // if (localVideoRef.current) {
         //    localVideoRef.current.srcObject = null;
         // }
         // if (remoteVideoRef.current) {
         //    remoteVideoRef.current.srcObject = null;
         // }
         console.log("localStream is",localStream);
         console.log("localStream ref is",localStreamRef.current);
         console.log("remoteSRef is",remoteStreamRef.current);
         console.log("RemoteStream is",remoteStream);
         socket.off('create-offer', GetMessage);
         socket.off('create-answer', GetAnswer);
         peer.close();
         navigate('/UserHome');
      })
      
         return () => {
            console.log("Cleaning up video streams and peer connection on unmount");
            
            console.log("cleanup localStream",localStream);
            //  if (localStream) {
            //     localStream.getTracks().forEach(track => track.stop());
            //     localVideoRef.current.srcObject = null;
            //    setLocalStream(null);
            // }
            console.log("cleanup remoteStream",remoteStream);
            
            // if (remoteStream) {
            //     remoteStream.getTracks().forEach(track => track.stop());
            //     remoteVideoRef.current.srcObject = null;
            //     setRemoteStream(null);
            // }
            // if (localVideoRef.current) {
            //    localVideoRef.current.srcObject = null;
            // }
            // if (remoteVideoRef.current) {
            //    remoteVideoRef.current.srcObject = null;
            // }
            
            // if (peer) {
            //     peer.close();
            // }
            
            socket.off('create-offer', GetMessage);
            socket.off('create-answer', GetAnswer);
        };
         
      
   }, []);
   console.log("localstream",localStream);
   console.log("remoteStream",remoteStream);
   return (
      <div className="bg-gray-800 h-screen flex flex-col justify-center items-center text-white">
         <h1 className="text-4xl font-bold mb-6">Video Chat</h1>
         <p className="text-lg mb-8">Connect and start your video call!</p>
         
         <div className="flex space-x-8">
            <video ref={localVideoRef} autoPlay muted className="w-72 h-40 bg-gray-700 rounded-md border border-white" />
            <video ref={remoteVideoRef} autoPlay className="w-72 h-40 bg-gray-700 rounded-md border border-white" />
         </div>
         
         {/* <div className="flex space-x-4 mt-8">
            <button onClick={SendMessage} className="bg-blue-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-600 transition duration-300 ease-in-out">
               Start Call
            </button>
         </div> */}
         <div className="flex space-x-4 mt-8">Wait For Your Call</div>
      </div>
   );
};

export default Video;
