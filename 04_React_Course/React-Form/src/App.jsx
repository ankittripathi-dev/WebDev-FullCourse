import React from 'react'
import SelectForm from './components/SelectForm'
import RadioForm from './components/RadioForm'
import CheckboxForm from './components/CheckboxForm'
import BasicForm from './components/BasicForm'
import MultiInputForm from './components/MultiInputForm'

const App = () => {
  return (
    <div>
      <BasicForm/>

      <MultiInputForm/>

      <SelectForm/>
      
      <RadioForm/>

      <CheckboxForm/>
    </div>
  )
}

export default App
