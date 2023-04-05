import React, { useState, useEffect } from 'react'
import './index.scss'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import * as ActionType from '../stored/actionTypes'
import { isEqual } from 'lodash'
import { io } from 'socket.io-client'
import ListContacts from '../components/ListContacts'
import Welcome from '../components/Welcome'
import ChatContainer from '../components/ChatContainer'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const socketClients = io("https://chatweb-production-f3bc.up.railway.app")
export default function Chat({ isOnline }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [roomID, setRoomID] = useState('')
  const toastOptions = {
    position: "top-center",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };
  const [currentChat, setCurrentChat] = useState(undefined);

  const user = useSelector(state => {
    const data = state.StoredReducer.user
    return data && typeof data === 'object' && Object.keys(data).length > 0 ? data : {}
  }, (prev, next) => isEqual(prev, next));

  useEffect(() => {
    if (!isOnline) {
      toast.error('No internet, please try again', toastOptions)
    }
  }, [isOnline])

  const listUser = useSelector(state => {
    const data = state.StoredReducer.listUser
    return data && Array.isArray(data) && data.length > 0 ? data : []
  }, (prev, next) => isEqual(prev, next));
  

  const handleChange = (chat) => {
    setCurrentChat(chat)
  }
  useEffect(() => {
    if (Object.keys(user).length <= 0) {
      navigate('/login')
    }
  }, [])
  useEffect(() => {
    try {
      if (user) {
        socketClients.on("connect", () => {
        })
        socketClients.on("room-receive", (data) => {
          if (data) {
            setRoomID(data)
          }
        })
        if (roomID._id) {
          socketClients.on("msg-receive", (data) => {
            if (data.roomID === roomID._id) {
              dispatch({
                type: ActionType.GET_MESSAGE,
                data: {
                  users: [user._id, currentChat._id],
                  roomID: data.roomID,
                },
                ttype: 'socket',
              })
            }
          })
        }
        return () => {
          socketClients.off("connect")
          socketClients.off("room-receive")
          socketClients.off("msg-receive")
        }
      }
    } catch (err) {

    }
  }, [user, roomID._id])
  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      if (user.isAvatarImageSet) {
        dispatch({
          type: ActionType.GET_ALL_USERS,
          data: {
            id: user._id
          },
        })
      } else {
        navigate('/setAvatar')
      }
    }
  }, [user])

  return (
    <React.Fragment>
      <div className='chat'>
        <div className='container'>
          <ListContacts socketClients={socketClients} user={user} listUser={listUser} changeChat={handleChange} />
          {currentChat === undefined ? (
            <Welcome user={user} />
          ) : (
            <ChatContainer currentChat={currentChat}  user={user} room={roomID} isOnline={isOnline} />
          )}
        </div>
      </div>
      <ToastContainer />
    </React.Fragment>
  )
}
