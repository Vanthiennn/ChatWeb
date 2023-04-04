import React from 'react'
import { BiPowerOff } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
export default function Logout({ user }) {
    const navigate = useNavigate()
    const handleClick = () => {
        if (user._id) {
            sessionStorage.clear();
            navigate('/login')
        }
    };
    return (
        <div className='logout' onClick={handleClick}>
            <BiPowerOff />
        </div>
    )
}
