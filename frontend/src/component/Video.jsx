import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../Providers/Socket';
import { usePeer } from '../Providers/WebRTC';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useData } from '../Providers/DataProvider';
import { Mic, MicOff, Video as VideoIcon, VideoOff, Phone, Monitor, StopCircle } from 'lucide-react';

const Video = () => {
  const navigate = useNavigate();
  const { isAuth } = useData();
  const { username } = useParams();
  const [userById, setUserById] = useState([]);
  const socket = useSocket();

  const { peer, SendOffer, RecieveAnswer, getCam } = usePeer();

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const localStreamRef = useRef();
  const remoteStreamRef = useRef();

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  // Control states
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const screenStreamRef = useRef();

  const GetUserId = async () => {
    try {
      const response = await axios.get('/api/v1/user/fetchById', { withCredentials: true });
      setUserById(response.data.data.username);
    } catch (error) {
      console.error("frontend error fetching userById", error);
    }
  };

  const SendLocalStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    setLocalStream(stream);
    localStreamRef.current = stream;
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    peer.addStream(stream);
  };

  const SendMessage = async () => {
    const offer = await SendOffer();
    socket.emit('message', { type: 'create-Offer', sdp: offer, you: userById, other: username });
  };

  const ReceiveVideo = (event) => {
    if (!remoteStream) {
      setRemoteStream(event.streams[0]);
      remoteStreamRef.current = event.streams[0];
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
    }
  };

  const endCall = () => {
    peer.close();
    socket.emit("disconnect-peer", { you: userById, other: username });
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    remoteStreamRef.current?.getTracks().forEach(track => track.stop());
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    navigate('/UserHome');
  };

  const toggleAudio = () => {
    localStreamRef.current?.getAudioTracks().forEach(t => t.enabled = !audioEnabled);
    setAudioEnabled(!audioEnabled);
  };

  const toggleVideo = () => {
    localStreamRef.current?.getVideoTracks().forEach(t => t.enabled = !videoEnabled);
    setVideoEnabled(!videoEnabled);
  };

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      screenStreamRef.current = screenStream;
      screenStream.getTracks().forEach(track => peer.addTrack(track, screenStream));
      setIsScreenSharing(true);
    } catch (err) {
      console.error("Screen share failed:", err);
    }
  };

  const stopScreenShare = () => {
    const ss = screenStreamRef.current;
    if (!ss) return;
    ss.getTracks().forEach(t => t.stop());
    setIsScreenSharing(false);
  };

  useEffect(() => {
    GetUserId();
    socket.emit("register", { you: userById });
    
    peer.onnegotiationneeded = SendMessage;
    
    socket.on('create-offer', async data => {
      await peer.setRemoteDescription(data);
      const answer = await RecieveAnswer();
      socket.emit('message', { type: 'create-answer', sdp: answer, you: userById, other: username });
    });
    
    socket.on('create-answer', async data => {
      await peer.setRemoteDescription(data);
    });

    SendLocalStream();
    peer.ontrack = ReceiveVideo;
    peer.onicecandidate = e => {
      if (e.candidate) {
        socket.emit("message", { type: "candidate", sdp: e.candidate, you: userById, other: username });
      }
    };

    socket.on("candidate", (data) => {
      peer.addIceCandidate(new RTCIceCandidate(data.sdp)).catch(err => console.error("candidate error", err));
    });

    socket.on("disconnect-peer", endCall);

    return () => {
      socket.off('create-offer');
      socket.off('create-answer');
      socket.off('candidate');
      socket.off('disconnect-peer');
    };
  }, [peer, socket, userById]);

  return (
    <div className="bg-black h-screen flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold mb-6">Video Chat</h1>

      <div className="flex space-x-8">
        <video ref={localVideoRef} autoPlay muted className="w-80 h-56 bg-black rounded-md border border-white" />
        <video ref={remoteVideoRef} autoPlay className="w-80 h-56 bg-black rounded-md border border-white" />
      </div>

      <div className="flex space-x-4 mt-8">
        <button onClick={toggleAudio} className="p-3 rounded-full border border-white hover:bg-white hover:text-black transition">
          {audioEnabled ? <Mic /> : <MicOff />}
        </button>
        <button onClick={toggleVideo} className="p-3 rounded-full border border-white hover:bg-white hover:text-black transition">
          {videoEnabled ? <VideoIcon /> : <VideoOff />}
        </button>
        {!isScreenSharing ? (
          <button onClick={startScreenShare} className="p-3 rounded-full border border-white hover:bg-white hover:text-black transition">
            <Monitor />
          </button>
        ) : (
          <button onClick={stopScreenShare} className="p-3 rounded-full border border-white hover:bg-white hover:text-black transition">
            <StopCircle />
          </button>
        )}
        <button onClick={endCall} className="p-3 rounded-full border border-red-500 hover:bg-red-600 hover:text-white transition">
          <Phone className="rotate-135"/>
        </button>
      </div>
    </div>
  );
};

export default Video;

