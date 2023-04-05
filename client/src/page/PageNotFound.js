import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { isEqual } from 'lodash'
export default function PageNotFound() {
  const user = useSelector(state => {
    const data = state.StoredReducer.user
    return data && typeof data === 'object' && Object.keys(data).length > 0 ? data : {}
  }, (prev, next) => isEqual(prev, next));
  const navigate = useNavigate()
  const handleGoBack = () => {
    if (Object.keys(user).length <= 0) {
      navigate('/login')
    } else {
      if (user.isAvatarImageSet) {
        navigate('/')
      } else {
        navigate('/setAvatar')
      }
    }
  }
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        height: '100%'
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 14 }}>OOPS! PAGE NOT FOUND</p>
        <strong style={{ fontSize: 200 }}>404</strong>
        <p>WE ARE SORRY, BUT THE PAGE YOU REQUESTED WAS NOT FOUND</p>
        <button style={{
          marginTop: 20,
          fontSize: 20,
          padding: '10px 20px',
          borderRadius: '10px',
          cursor: 'pointer'
        }} onClick={handleGoBack}>GO BACK </button>
      </div>
    </div>
  )
}
