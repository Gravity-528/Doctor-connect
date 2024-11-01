import React, { useEffect, useState } from 'react'
import { useSocket } from '../Providers/Socket';
import { usePeer } from '../Providers/WebRTC';

const Video = () => {
   const socket=useSocket();

   const {peer,SendOffer,RecieveAnswer}=usePeer();
   
   const SendMessage=async()=>{
     const offer=await SendOffer();
     socket.emit('message',{type:'create-Offer',sdp:offer,you,other});
   }
   const GetMessage=async(data)=>{
      await peer.setRemoteDescription(data);
      const answer=await RecieveAnswer();
      
      socket.emit('message',{type:'create-answer',sdp:answer,you,other});
   }
   const GetAnswer=async(data)=>{
      peer.setRemoteDescription(data);
   }
   useEffect(()=>{
    peer.onnegotiationneeded=SendMessage;
    socket.on('create-offer',GetMessage);
    socket.on('create-answer',GetAnswer);

    return(()=>{
        socket.off('create-Offer');
        socket.off('create-answer');
    })
   },[])
  return (
    <>
        <div>

        </div>
    </>
  )
}

export default Video