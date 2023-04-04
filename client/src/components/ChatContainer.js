import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as ActionType from '../stored/actionTypes'
import { isEqual } from "lodash";
import ChatInput from "./ChatInput";
import './chat.scss'
import { io } from 'socket.io-client'
import Logout from "./Logout";
const socketClients = io("https://chat-web-vanthiennn.vercel.app/")
export default function ChatContainer({ user, currentChat, room, isOnline }) {
  const message = useSelector(state => {
    const data = state.StoredReducer.message
    return data && Array.isArray(data) && data.length > 0 ? data : []
  }, (prev, next) => isEqual(prev, next));
  const scrollRef = useRef()
  const dispatch = useDispatch()
  useEffect(() => {
    if (user._id && currentChat._id) {
      dispatch({
        type: ActionType.GET_MESSAGE,
        data: {
          users: [user._id, currentChat._id],
          roomID: room._id
        },
        ttype: 'fetch-data',
      })
    }
  }, [currentChat, room])
  const handleSendMess = (msg) => {
    if (user._id && currentChat._id) {
      socketClients.emit("send-msg", {
        users: [user._id, currentChat._id],
        msg,
        roomID: room._id
      })
      dispatch({
        type: ActionType.ADD_MESSAGE,
        data: {
          users: [user._id, currentChat._id],
          msg,
          roomID: room._id
        },
        ttype: 'add-message',
      })
      return () => {
        socketClients.off("send-msg")
      }
    }
  }
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [message])
 
  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            {currentChat && currentChat.avatarImage ?
              <img
                src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                alt=""
              />
              : ''}
          </div>
          <div className="username">
            <h3>{currentChat && currentChat.username ? currentChat.username : ''}</h3>
          </div>
        </div>
        <Logout user={user} />
      </div>
      <div className="chat-messages">
        {message && message.length > 0 ? message.map((item, index) => {
          return (
            <div ref={scrollRef} key={index}>
              <div
                className={`message ${item && item.fromSelf ? "sended" : "recieved"
                  }`}
              >
                <div className="content ">
                  <p>{item && item.msg ? item.msg : ''}</p>
                </div>
              </div>
            </div>
          );
        }) : null}
      </div>
      <ChatInput handleSendMess={handleSendMess} isOnline={isOnline} />
    </div>
  )
}
