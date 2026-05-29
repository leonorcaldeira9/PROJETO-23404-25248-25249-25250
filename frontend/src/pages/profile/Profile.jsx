//import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import './profile.css';
import { useEffect, useState } from "react";
//import {useEffect, useState} from "react";
//import logo from "../../assets/logo.png";
//import AlertModal from "../../components/alertModal.jsx";
import 'bootstrap-icons/font/bootstrap-icons.css';
//import Feed from "../feed/Feed.jsx";
import Navbar from "../../components/navBar.jsx";

const Profile= ()=>{
    const [userData, setUserData] = useState(null);

    // State to handle the loading screen while waiting for the database
    const [isLoading, setIsLoading] = useState(true);


    const fetchuserData =async ()=>{
        try{
            const token=localStorage.getItem('token')
            if(!token){
                console.error("Token not found");
                setIsLoading(false)
                return;
            }

            const response=await axios.get('http://localhost:3001/users/15', {
                headers: {
                    Authorization:`Bearer ${token}`
                }
            });


            setUserData(response.data);
        }catch (err){
            console.error("No user data");
            console.error("server error", err.response?.status, err.response?.data);
            console.error("error message:", err.message);
        }finally {
            setIsLoading(false);
        }
    };
    useEffect(()=>{
        fetchuserData();
    },[]);

    if (isLoading){
        return <div>Loading...</div>
    }

    return(<div className = "background">
        <Navbar/>

        <div className = "card shadow-sm border-0 mt-5 w-100 mx-auto" style={{ maxWidth: '800px' }}>


            <div className = "banner"></div>

            <div className="px-4">

                <img src="../../../public/users/15.jpeg" alt="foto de perfil" className="userCircle"/>

                <div className="mt-3 pb-4">
                    <h3 className="mb-0 fw-bold mx-2">{userData?.fullName || 'undefined'}</h3>
                    <p className="mb-0 text-muted">Full stack programmer</p>
                </div>

            </div>
        </div>
    </div>);
};





export default Profile;
