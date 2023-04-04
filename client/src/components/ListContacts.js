import React, { useState, useEffect } from 'react'
import Logo from '../assets/chat.png'
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash';
export default function ListContacts({ user, listUser, changeChat, socketClients }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
 
  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      if (user.username && user.avatarImage) {
        setCurrentUserName(user.username);
        setCurrentUserImage(user.avatarImage);
      }
    }
  }, [])

  const changeCurrentChat = (index, contact) => {
    try {
      setCurrentSelected(index)
      changeChat(contact)
      socketClients.emit("join_room", { from: user._id, to: contact._id })
    } catch (err) {
     
    }
  }

  return (
    <React.Fragment>
      {currentUserImage && currentUserName ?
        <div className='list-user'>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>Messenger</h3>
          </div>

          <div className="contacts">
            {listUser && Array.isArray(listUser) && listUser.length > 0 ? listUser.map((item, index) => {
              if (item._id !== user._id) {
                return (
                  <div
                    key={item._id}
                    className={`contact ${index === currentSelected ? "selected" : ""
                      }`}
                    onClick={() => changeCurrentChat(index, item)}
                  >
                    <div className="avatar">
                      <img
                        src={`data:image/svg+xml;base64,${item.avatarImage}`}
                        alt=""
                      />
                    </div>
                    <div className="username">
                      <h3>{item.username}</h3>
                    </div>
                  </div>
                );
              }
            }) : null}
          </div>
          <div className="current-user">
            <div className="avatar">
              {currentUserImage ? <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
              /> : ''}

            </div>
            <div className="username">
              <h2>{currentUserName ? currentUserName : ''}</h2>
            </div>
          </div>
        </div>
        : 'Something wrong. Please try again!'}
    </React.Fragment>
  )
}
