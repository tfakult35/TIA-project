import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import 'bootstrap/dist/css/bootstrap.min.css'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Header/>
    <div className='container'>
      
    </div>
    </>
  )
}

export default App
