import React from "react";

const PeerContext=React.createContext(null);



export const usePeer=()=>{
    return React.useContext(PeerContext);
}
export const PeerProvider=(props)=>{

    const peer=new RTCPeerConnection({
        iceServers:[
            {urls:'stun:stun.l.google.com:19302'}
        ]
    })
    
    const SendOffer=async()=>{
       const offer=await peer.createOffer();
       peer.setLocalDescription(offer);
       return offer;
    }

    const RecieveAnswer=async()=>{
        const answer=await peer.createAnswer();
        peer.setLocalDescription(answer);
        return answer;
    }

    const getCam=async()=>{
        const streams=await navigator.mediaDevices.getUserMedia({audio:true,video:true});

        return streams;
    }
   return(
    <PeerContext.Provider value={{peer,SendOffer,RecieveAnswer,getCam}}>
        {props.children}
    </PeerContext.Provider>
   )
}