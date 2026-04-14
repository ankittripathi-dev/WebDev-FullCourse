import React from 'react'
import Title from './Components/Title'

function Description(){
  return <h3>I am Description</h3>
}

const App = () => {
  return (
    <div>
      <h1>This is app components</h1>

      <Title/>

      <Description/>
    </div>
  )
}

export default App

