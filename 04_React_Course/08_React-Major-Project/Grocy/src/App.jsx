import Home from './components/Home/Home'
import {createBrowserRouter, RouterProvider } from 'react-router-dom'
import Fruits from './components/Fruits/Fruits'
import Dairy from './components/Dairy/Dairy'
import Meat from './components/Meat/Meat'
import AllProducts from './components/All Products/AllProducts'
import Layout from './components/Layout/Layout'
import Values from './components/Values/Values'
import Process from './components/Process/Process'


function App() {
  const router = createBrowserRouter([
  {
    path:"/",
    element:<Layout/>,
    children:[
    {
      path:"/",
      element:<Home/>,
    },
    {
      path:"/fruits-veggies",
      element:<Fruits/>
    },
    {
      path:"/dairy-eggs",
      element:<Dairy/>
    },
    {
      path:"/meat-seafood",
      element:<Meat/>
    },
    {
      path:"/all-products",
      element:<AllProducts/>
    },
    {
      path:"/values",
      element:<Values/>
    },
    {
      path:"/process",
      element:<Process/>
    },
    {
    
    }

    ]

  }
  ])
  return <RouterProvider router={router}/>
}

export default App


