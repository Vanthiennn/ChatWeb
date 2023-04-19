import React, { useEffect, useState } from "react";
import { Buffer } from "buffer";
import axios from "axios";
import loader from "../assets/loader-unscreen.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { isEqual } from "lodash";
import * as ActionType from '../stored/actionTypes'
import DefaultAvatar1 from '../assets/DefaultAvatar1.png'
import DefaultAvatar2 from '../assets/DefaultAvatar2.png'
import DefaultAvatar3 from '../assets/DefaultAvatar3.png'
import DefaultAvatar4 from '../assets/DefaultAvatar4.png'
import DefaultAvatar5 from '../assets/DefaultAvatar5.png'
import DefaultAvatar6 from '../assets/DefaultAvatar6.png'
import DefaultAvatar7 from '../assets/DefaultAvatar7.png'
import DefaultAvatar8 from '../assets/DefaultAvatar8.png'
import DefaultAvatar9 from '../assets/DefaultAvatar9.png'
import DefaultAvatar10 from '../assets/DefaultAvatar10.png'
import DefaultAvatar11 from '../assets/DefaultAvatar11.png'
import DefaultAvatar12 from '../assets/DefaultAvatar12.png'
import DefaultAvatar13 from '../assets/DefaultAvatar13.png'
import DefaultAvatar14 from '../assets/DefaultAvatar14.png'
import DefaultAvatar15 from '../assets/DefaultAvatar15.png'
import DefaultAvatar16 from '../assets/DefaultAvatar16.png'
import DefaultAvatar17 from '../assets/DefaultAvatar17.png'
import DefaultAvatar18 from '../assets/DefaultAvatar18.png'
import DefaultAvatar19 from '../assets/DefaultAvatar19.png'
import DefaultAvatar20 from '../assets/DefaultAvatar20.png'


export default function SetAvatar({ isOnline }) {

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const [flag, setFlag] = useState(0)
  // API to get avatar 
  const apiAvatar = `https://api.multiavatar.com`;
  const randomAvatar = [
    DefaultAvatar1, DefaultAvatar2, DefaultAvatar3, DefaultAvatar4, DefaultAvatar5,
    DefaultAvatar6, DefaultAvatar7, DefaultAvatar8, DefaultAvatar9, DefaultAvatar10,
    DefaultAvatar11, DefaultAvatar12, DefaultAvatar13, DefaultAvatar14, DefaultAvatar15,
    DefaultAvatar16, DefaultAvatar17, DefaultAvatar18, DefaultAvatar19, DefaultAvatar20
  ]
  const toastOptions = {
    position: "top-center",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  const user = useSelector(state => {
    const data = state.StoredReducer.user
    return data && typeof data === 'object' && Object.keys(data).length > 0 ? data : {}
  }, (prev, next) => isEqual(prev, next));


  useEffect(() => {
    if (!isOnline) {
      toast.error('No internet, please try again', toastOptions)
    }
  }, [isOnline])

  useEffect(() => {
    if (Object.keys(user).length <= 0) {
      navigate('/login')
    }
  }, [])

  const setProfilePicture = () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      dispatch({
        type: ActionType.SET_AVATAR,
        data: {
          id: user._id,
          image: avatars[selectedAvatar],
        },
        navigate
      })
    }
  }
  // Fetch apiAvatar to get avatar for user  
  useEffect(() => {
    let data = [];
    for (let i = 0; i < 4; i++) {
      const random = Math.floor(Math.random() * randomAvatar.length);
      if (!data.includes(randomAvatar[random])) {
        data.push(randomAvatar[random])
      } else {
        data.push(randomAvatar[Math.floor(Math.random() * randomAvatar.length)])
      }
      setAvatars(data);
      setIsLoading(false);
    }

  }, [flag]);
  return (
    <React.Fragment>
      {isLoading ? (
        <div className="set-avatar">
          <img src={loader} alt="loader" className="loader" />
          <ToastContainer />
        </div>
      ) : (
        <div className="set-avatar">
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars && avatars.length > 0 ? avatars.map((avatar, index) => {

              return (
                <div
                  key={index}
                  className={`avatar ${selectedAvatar === index ? "selected" : ""
                    }`}
                >
                  <img
                    src={avatar}
                    alt="avatar"
                    key={avatar}
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            }) : null}

          </div>
          <div>
            <button onClick={setProfilePicture} className="submit-btn">
              Set as Profile Picture
            </button>
            <button style={{marginLeft:30}} onClick={() => setFlag(Math.floor(Math.random() * 1000))} className="submit-btn">
              Reload
            </button>
          </div>
          <ToastContainer />
        </div>
      )}
    </React.Fragment>

  )
}
