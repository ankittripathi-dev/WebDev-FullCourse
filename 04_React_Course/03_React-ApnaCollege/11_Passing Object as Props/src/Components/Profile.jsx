import React from 'react'

function Profile(props) {
    return (
      <div>
        <h1>Name: {props.user.name}</h1>
        <h4>Email: {props.user.email}</h4>
      </div>
    )
  }

export default Profile
