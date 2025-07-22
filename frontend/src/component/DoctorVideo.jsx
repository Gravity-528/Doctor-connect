import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../Providers/Socket';
import { usePeer } from '../Providers/WebRTC';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Mic, MicOff, Video, VideoOff, Phone, Play,Monitor,StopCircle } from 'lucide-react';

const DoctorVideo = () => {
  const { total } = useParams();
  const [username, time] = total.split("+");
  const navigate = useNavigate();

  const { peer, SendOffer } = usePeer();
  const [doctorBhai, setDoctorBhai] = useState();
  const [slotid, setSlotId] = useState();
  const [userId, setUserId] = useState();

  const socket = useSocket();
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const screenStreamRef = useRef();

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const localStreamRef = useRef();
  const remoteStreamRef = useRef();

  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r1 = await axios.get("/api/v1/doctor/doctorBhai", { withCredentials: true });
        setDoctorBhai(r1.data.data);
        socket.emit("register", { you: r1.data.data.username });

        const r2 = await axios.post("/api/v1/Slot/askSlotId", {
          time, doctorId: r1.data.data._id
        }, { withCredentials: true });
        setSlotId(r2.data.data[0]._id);

        const r3 = await axios.post("/api/v1/user/userUsername", {
          username
        }, { withCredentials: true });
        setUserId(r3.data.data[0]._id);

      } catch (e) {
        console.error("Data fetch error:", e);
      }
    })();
  }, [socket, time, username]);

  const SendLocalStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    });
    localStreamRef.current = stream;
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    peer.addStream(stream);
  };

  const SendMessage = async () => {
    const offer = await SendOffer();
    socket.emit("message", {
      type: 'create-Offer',
      sdp: offer,
      you: doctorBhai.username,
      other: username
    });
    setTimeout(() => endCall(), 40 * 60 * 1000);
  };

  const ReceiveVideo = event => {
    if (!remoteStreamRef.current) {
      remoteStreamRef.current = event.streams[0];
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
    }
  };

  useEffect(() => {
    peer.onnegotiationneeded = SendMessage;

    socket.on('create-offer', async data => {
      await peer.setRemoteDescription(data.sdp);
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      socket.emit("message", {
        type: 'create-answer',
        sdp: answer,
        you: doctorBhai.username,
        other: username
      });
    });

    socket.on('create-answer', async data => {
      await peer.setRemoteDescription(data);
    });

    SendLocalStream();

    peer.ontrack = ReceiveVideo;
    peer.onicecandidate = e => {
      if (e.candidate) {
        socket.emit("message", {
          type: "candidate",
          sdp: e.candidate,
          you: doctorBhai.username,
          other: username
        });
      }
    };

    socket.on("candidate", data =>
      peer.addIceCandidate(new RTCIceCandidate(data))
        .catch(err => console.error("Error adding candidate", err))
    );

    window.addEventListener("beforeunload", endCall);

    return () => {
      socket.off("create-offer");
      socket.off("create-answer");
      socket.off("candidate");
      window.removeEventListener("beforeunload", endCall);
    };
  }, [peer, socket, doctorBhai, username]);

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
      const screenStream = await navigator.mediaDevices.getDisplayMedia({video: true});
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

//   const endCall = async () => {
//     peer.close();
//     socket.emit("disconnect-peer", {
//       you: doctorBhai.username,
//       other: username
//     });
//     localStreamRef.current?.getTracks().forEach(t => t.stop());
//     remoteStreamRef.current?.getTracks().forEach(t => t.stop());
//    //  await axios.post("/api/v1/Slot/unBookSlot", {
//    //    slotid, userId
//    //  }, { withCredentials: true });
//     navigate('/DoctorHome');
//   };
const endCall = async () => {
  peer.close();

  socket.emit("disconnect-peer", { you: doctorBhai.username, other: username });

  const localStream = localStreamRef.current;
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
  }
  if (localVideoRef.current) {
    localVideoRef.current.srcObject = null;
  }

  const remoteStream = remoteStreamRef.current;
  if (remoteStream) {
    remoteStream.getTracks().forEach(track => track.stop());
  }
  if (remoteVideoRef.current) {
    remoteVideoRef.current.srcObject = null;
  }
 
  navigate('/DoctorHome');
};

  return (
    <div className="bg-black h-screen flex flex-col items-center justify-center text-white space-y-6">
      <h1 className="text-4xl font-bold">Video Chat</h1>

      <div className="flex space-x-8">
        <video ref={localVideoRef} autoPlay muted className="w-96 h-64 bg-black rounded-md border border-white" />
        <video ref={remoteVideoRef} autoPlay className="w-96 h-64 bg-black rounded-md border border-white" />
      </div>

      <div className="flex space-x-4">
        <button
          onClick={toggleAudio}
          className="p-3 rounded-full border border-white hover:bg-white hover:text-black transition"
        >
          {audioEnabled ? <Mic /> : <MicOff />}
        </button>
        <button
          onClick={toggleVideo}
          className="p-3 rounded-full border border-white hover:bg-white hover:text-black transition"
        >
          {videoEnabled ? <Video /> : <VideoOff />}
        </button>

        {/* Screen-share toggle */}
        {!isScreenSharing ? (
          <button onClick={startScreenShare} className="p-3 rounded-full border border-white hover:bg-white hover:text-black transition flex items-center space-x-2">
            <Monitor /><span>Share</span>
          </button>
        ) : (
          <button onClick={stopScreenShare} className="p-3 rounded-full border border-white hover:bg-white hover:text-black transition flex items-center space-x-2">
            <StopCircle /><span>Stop Share</span>
          </button>
        )}

        <button
          onClick={endCall}
          className="p-3 rounded-full border border-red-500 hover:bg-red-600 hover:text-white transition"
        >
          <Phone className="rotate-135" />
        </button>
        <button
          onClick={SendMessage}
          className="p-3 rounded-full border border-white hover:bg-white hover:text-black transition flex items-center space-x-2"
        >
          <Play />
          <span>Start Call</span>
        </button>
      </div>
    </div>
  );
};

export default DoctorVideo;

