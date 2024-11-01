// import React, { useEffect, useRef, useState } from 'react'
// import { useSocket } from '../Providers/Socket';
// import { usePeer } from '../Providers/WebRTC';

// const Video = () => {
//    const socket=useSocket();

//    const LocalVideoRef=useRef();
//    const RemoteVideoRef=useRef();

//    const [LocalStream,SetLocalStream]=useState(null);
//    const [RemoteStream,SetRemoteStream]=useState(null);

//    const SendLocalStream=async()=>{
//      const stream=await navigator.mediaDevices.getUserMedia({audio:true,video:true});
//      SetLocalStream(stream);

//      if(LocalVideoRef.current){
//       localVideoRef.current.srcObject = stream;
//      }
//      peer.addStream(stream);
//    };

//    const {peer,SendOffer,RecieveAnswer,getCam}=usePeer();
   
//    const SendMessage=async()=>{
//      const offer=await SendOffer();
//      socket.emit('message',{type:'create-Offer',sdp:offer,you,other});
//    }
//    const GetMessage=async(data)=>{
//       await peer.setRemoteDescription(data);
//       const answer=await RecieveAnswer();
      
//       socket.emit('message',{type:'create-answer',sdp:answer,you,other});
//    }
//    const GetAnswer=async(data)=>{
//       peer.setRemoteDescription(data);
//    }
//    const RecieveVideo=async(event)=>{
//     if (!RemoteStream) {
//       setRemoteStream(event.streams[0]);
//       if (RemoteVideoRef.current) {
//          RemoteVideoRef.current.srcObject = event.streams[0];
//       }
//    }
//    }
//    useEffect(()=>{
//     peer.onnegotiationneeded=SendMessage;
//     socket.on('create-offer',GetMessage);
//     socket.on('create-answer',GetAnswer);

//     SendLocalStream();

//     peer.ontrack=RecieveVideo;

//     return(()=>{
//         socket.off('create-Offer');
//         socket.off('create-answer');
//     })
//    },[])
//   return (
//     <>
//         <div>
//         <video ref={localVideoRef} autoPlay muted style={{ width: '300px' }} />
//         <video ref={remoteVideoRef} autoPlay style={{ width: '300px' }} />
//         </div>
//     </>
//   )
// }

// export default Video
import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../Providers/Socket';
import { usePeer } from '../Providers/WebRTC';

const Video = () => {
   const socket = useSocket();
   const { peer, SendOffer, RecieveAnswer, getCam } = usePeer();

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
      const offer = await SendOffer();
      socket.emit('message', { type: 'create-Offer', sdp: offer });
   };

   const GetMessage = async (data) => {
      await peer.setRemoteDescription(data);
      const answer = await RecieveAnswer();
      socket.emit('message', { type: 'create-answer', sdp: answer });
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
      peer.onnegotiationneeded = SendMessage;
      socket.on('create-offer', GetMessage);
      socket.on('create-answer', GetAnswer);

      SendLocalStream();

      peer.ontrack = ReceiveVideo;

      return () => {
         socket.off('create-offer', GetMessage);
         socket.off('create-answer', GetAnswer);
      };
   }, []);

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

export default Video;
