import React, { useEffect, useState } from "react";
import axios from "axios"

const DataContext=React.createContext();

export const useData=()=>{
    return React.useContext(DataContext);
}

export const ReactProvider=({children})=>{
    const [UserSlot,setUserSlot]=useState({});
    const [DoctorSlot,setDoctorSlot]=useState({});
    const [AllSlot,setAllSlot]=useState({});

    const GetDoctorSlot=async()=>{
        try{
        const OtherSlot=await axios.get('https://localhost:8000/api/v1/doctor/doctorSlot',{withCredentials:true});
        setDoctorSlot(OtherSlot.data);
        }catch(err){
            console.error("error in fetching OtherSlot",err);
        }
    }

    const GetUserSlot=async()=>{
        try{
            const YourSlot=await axios.get('https://localhost:8000/api/v1/user/getSlot',{withCredentials:true});
            setUserSlot(YourSlot.data);
            }catch(err){
                console.error("error is here :",err);
            }
    }

    const GetAllSlot=async()=>{
        try {
            const fetchSlot=await axios.get('https://localhost:8000/api/v1/Slot/AllSlot',{withCredentials:true});
            setAllSlot(fetchSlot.data);
        } catch (error) {
            console.error("error in fetching all slots",error);
        }
    }

    useEffect(()=>{
        const fetch=async()=>{
          await GetUserSlot();
          await GetDoctorSlot();
          await GetAllSlot();
        }
        fetch();
    },[]);
    return(
    <DataContext.Provider value={{UserSlot,setUserSlot,DoctorSlot,setDoctorSlot,AllSlot,setAllSlot}}>
       {children}
    </DataContext.Provider>
    )
}