import React, { useEffect, useState } from "react";
import axios from "axios"

const DataContext=React.createContext();

export const useData=()=>{
    return React.useContext(DataContext);
}

export const DataProvider=({children})=>{

    const [UserSlot,setUserSlot]=useState({});
    const [DoctorSlot,setDoctorSlot]=useState({});
    const [AllSlot,setAllSlot]=useState({});
    const [Doctor,setDoctor]=useState({});
    const [userById,setUserById]=useState({});
    const [isAuth,setIsAuth]=useState({valid:false,role:null});


    const RegisterUserGet=async(name,username,password,email)=>{
        try {
            const response=await axios.post("/api/v1/user/register",{name,username,password,email},{withCredentials:true});
            if(!response){
                console.error("error in registering user try again");
            }
        } catch (error) {
            console.error("error in registering the user try again",error);
        }
    }
    
    const LoginUserGet=async(username,password)=>{
        try{
           const response=await axios.post("/api/v1/user/login",{username,password},{withCredentials:true});
           const value=response.data.val;
           console.log("value is",response.data.val);
           setIsAuth({valid:value.valid,role:value.role});
           console.log("isAuth is ",isAuth);
           return response;
        }catch(error){
            console.error("error in login in frontend part",error);
        }
    }
    const LoginDoctorGet=async(username,password)=>{
        try{
           const response=await axios.post("/api/v1/doctor/loginDoctor",{username,password},{withCredentials:true});
           const value=response.data.val;
        //    setIsAuth({valid:value.valid,role:value.role});
        setIsAuth({valid: value.valid, role: value.role });
        return response;
        }catch(error){
            console.error("error in login in frontend part",error);
        }
    }
    // const RegisterDoctorGet=async(name,email,qualification,username,password)=>{
    //     try {
    //         const response=await axios.post("/api/v1/doctor/registerDoctor",{name,email,qualification,username,password},{withCredentials:true});
    //         if(!response){
    //             console.error("error in registering user try again");
    //         }
    //         console.log("response is",response);
    //     } catch (error) {
    //         console.error("error in registering the user try again",error);
    //     }
    // }
    const RegisterDoctorGet=async(data)=>{
        try {
            const response=await axios.post("/api/v1/doctor/registerDoctor",data,{withCredentials:true});
            if(!response){
                console.error("error in registering user try again");
            }
            console.log("response is",response);
            return response
        } catch (error) {
            console.error("error in registering the user try again",error);
        }
    }
    // const GetUserId=async()=>{
    //     try {
    //         const response=await axios.get('https://localhost:8000/api/v1/user/fetchById',{withCredentials:true});
    //         setUserById(response.data);
    //     } catch (error) {
    //         console.error("some frontend error in fetching userById",error);
    //     }
    // }

    const GetDoctorSlot=async()=>{
        try{
        const OtherSlot=await axios.get('/api/v1/doctor/doctorSlot',{withCredentials:true});
        setDoctorSlot(OtherSlot.data);
        }catch(err){
            console.error("error in fetching OtherSlot",err);
        }
    }
    // const GetAllDoctor=async()=>{
    //     try {
    //         const response=await axios.get('/api/v1/doctor/allDoctor',{withCredentials:true});
    //         setDoctor(response.data);
    //     } catch (error) {
    //         console.error("error in fetching the doctor",error);
    //     }
    // }
    // const GetUserSlot=async()=>{
    //     try{
    //         const YourSlot=await axios.get('https://localhost:8000/api/v1/user/getSlot',{withCredentials:true});
    //         setUserSlot(YourSlot.data);
    //         }catch(err){
    //             console.error("error is here :",err);
    //         }
    // }

    const GetAllSlot=async()=>{
        try {
            const fetchSlot=await axios.get('/api/v1/Slot/AllSlot',{withCredentials:true});
            setAllSlot(fetchSlot.data);
        } catch (error) {
            console.error("error in fetching all slots",error);
        }
    }

    // useEffect(()=>{
    //     const fetch=async()=>{
    //     //   await GetUserSlot();
    //     //   await GetDoctorSlot();
    //     //   await GetAllSlot();
    //     //   await GetAllDoctor();
    //     //   await GetUserId();
    //     }
    //     fetch();
    // },[]);
    useEffect(()=>{
       console.log("isAuth updated",isAuth);
    },[isAuth]);
    return(
    <DataContext.Provider value={{DoctorSlot,setDoctorSlot,AllSlot,setAllSlot,Doctor,setDoctor,LoginUserGet,isAuth,setIsAuth,RegisterUserGet,LoginDoctorGet,RegisterDoctorGet}}>
       {children}
    </DataContext.Provider>
    )
}