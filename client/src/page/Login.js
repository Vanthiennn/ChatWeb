import React, { useState, useEffect } from 'react'
import './index.scss'
import Logo from '../assets/chat.png'
import Background from '../assets/giphy.gif'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import * as ActionType from '../stored/actionTypes'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Login({ isOnline }) {
  const toastOptions = {
    position: "top-center",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!isOnline) {
      toast.error('No internet, please try again', toastOptions)
    } 
  }, [isOnline])
 
  const [value, setValue] = useState({
    email: '',
    password: ''
  })
  // Create flag for navigate when click Login
  const [existUser, setExistUser] = useState(false)
  // Create loading when waiting load data 
  const [loading, setLoading] = useState(false)
  const handleOnChange = (e) => {
    if (e) {
      setValue({ ...value, [e.target.name]: e.target.value })
    }
  }

  const validateForm = () => {
    const { email, password } = value
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email === '' || email.trim() === '') {
      toast.error("Email is required!", toastOptions);
      return false
    } else if (!email.match(validRegex)) {
      toast.error("Invalid email address! Please try again!", toastOptions);
      return false
    }
    if (password === '' || password.trim() === '') {
      toast.error("Password is required!", toastOptions);
      return false
    }
    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const { email, password } = value
      setLoading(true)
      dispatch({
        type: ActionType.LOG_IN,
        data: { email, password },
        setExistUser,
        setLoading
      })
    }
  }
  useEffect(() => {
    if (existUser) {
      navigate('/')
    }
  }, [existUser])

  return (
    <React.Fragment>
      <div className='login'>
        <div className='background-login' >
          <img src={Background} alt="background GIF" width="100%"></img>
        </div>
        <div className='content'>
          <form onSubmit={(e) => handleSubmit(e)} className='form-login'>
            <div className='brand'>
              <img src={Logo} alt='logo brand' />
            </div>
            <input type='text' placeholder='Email' name='email' onChange={(e) => handleOnChange(e)} min='3' />
            <input type='password' placeholder='Password' name='password' onChange={(e) => handleOnChange(e)} />
            <button type="submit" disabled={loading || !isOnline ? true : false} className={`${loading || !isOnline ? 'disable' : ''}`}>Log In</button>
            <span>
              Don't have an account ? <Link to="/register">Create One.</Link>
            </span>
          </form>
        </div>
      </div>
      <ToastContainer />
    </React.Fragment>
  )
}
