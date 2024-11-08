import axios from "axios";
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const SocketContext = React.createContext(null);

export const useSocket = () => {
  return React.useContext(SocketContext);
}

export const SocketProvider = (props) => {
  const [socket, setSocket] = useState(null);
  const [userId,setUserId]=useState([]);
  // const UserFetch=async()=>{
  //   const response=await axios.get("http://localhost:8000/api/v1/user/fetchById",{withCredentials:true});
  //   setUserId(response.data.data.username);

  //   socket.emit("register",{you:userId});
  // }

  useEffect(() => {
    const socketInstance = io('http://localhost:8000');
    setSocket(socketInstance);
    
    
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
}

