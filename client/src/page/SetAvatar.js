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
export default function SetAvatar({ isOnline }) {

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  // API to get avatar 
  const apiAvatar = `https://api.multiavatar.com/4645646`;

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

    const fetchAvatar = async () => {
      try {
        for (let i = 0; i < 4; i++) {
          const image = await axios.get(
            `${apiAvatar}/${Math.round(Math.random() * 1000)}`
          );
          if (image) {
            const buffer = new Buffer(image.data);
            data.push(buffer.toString("base64"));
          }

        }
        setAvatars(data);
        setIsLoading(false);
      } catch (err) {
        toast.error(`Something's wrong, please try again`, toastOptions);
      }
    }
    fetchAvatar()

  }, []);

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
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    key={avatar}
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            }) : null}

          </div>
          <button onClick={setProfilePicture} className="submit-btn">
            Set as Profile Picture
          </button>
          <ToastContainer />
        </div>
      )}
    </React.Fragment>

  )
}
