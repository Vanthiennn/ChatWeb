
import React, { useState, useEffect } from 'react'
import './index.scss'
import Logo from '../assets/chat.png'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, } from 'react-redux'
import * as ActionType from '../stored/actionTypes'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Register({ isOnline }) {
  const toastOptions = {
    position: "top-center",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [value, setValue] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  useEffect(() => {
    if (!isOnline) {
      toast.error('No internet, please try again', toastOptions)
    }
  }, [isOnline])
  // Create flag for navigate when click Register
  const [existUser, setExistUser] = useState(false)

  // Create loading when waiting load data 
  const [loading, setLoading] = useState(false)
  const handleOnChange = (e) => {
    if (e) {
      setValue({ ...value, [e.target.name]: e.target.value })
    }
  }

  const validateForm = () => {
    const { password, confirmPassword, username, email } = value;
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (username === '' || username.trim() === '') {
      toast.error("Username is required!", toastOptions);
      return false
    } else if (username.length < 3) {
      toast.error("Username should be greater than 3 characters!", toastOptions);
      return false
    }

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
    } else if (password !== confirmPassword) {
      toast.error("Password and confirm password should be same!", toastOptions);
      return false
    }
    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const { password, username, email } = value;
      setLoading(true)
      dispatch({
        type: ActionType.REGISTER,
        data: { email, password, username },
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
          <img src="https://media.giphy.com/media/26FPJGjhefSJuaRhu/giphy.gif" alt="background GIF" width="100%"></img>
        </div>
        <div className='content'>
          <form onSubmit={(e) => handleSubmit(e)} className='form-login'>
            <div className='brand'>
              <img src={Logo} alt='logo brand' />
            </div>
            <input type='text' placeholder='Username' name='username' onChange={(e) => handleOnChange(e)} min='3' />
            <input type='text' placeholder='Email' name='email' onChange={(e) => handleOnChange(e)} min='3' />
            <input type='password' placeholder='Password' name='password' onChange={(e) => handleOnChange(e)} />
            <input type='password' placeholder="Confirm Password" name="confirmPassword" onChange={(e) => handleOnChange(e)} />
            <button type="submit" disabled={loading || !isOnline ? true : false} className={`${loading || !isOnline ? 'disable' : ''}`}>Create User</button>
            <span>
              Already have an account ? <Link to="/login">Login.</Link>
            </span>
          </form>
        </div>
      </div>
      <ToastContainer />
    </React.Fragment>
  )
}
