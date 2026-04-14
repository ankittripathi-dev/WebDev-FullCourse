import './App.css'
import CompanyLogo from './components/CompanyLogo'
import FeaturesSection from './components/FeaturesSection'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import PurposeSection from './components/PurposeSection'
import ScheduleScetion from './components/ScheduleScetion'
import MonitorSection from './components/MonitorSection'
import PricingSection from './components/PricingSection'
import ServiceSection from './components/ServiceSection'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'
function App() {
  
  return (
    <main className='reative min-h-screen overflow-x-hidden'>
      <div className='absolute -top-28 -left-28 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 rounded-full blur-[80px] -z-10'></div>
      <div className='overflow-hidden'>
        <Navbar/>
        <Hero/>
        <CompanyLogo/>
       <PurposeSection/>
       <FeaturesSection/>
       <ScheduleScetion/>
       <MonitorSection/>
       <PricingSection/>
       <ServiceSection/>
       <Newsletter/>
       <Footer/>
      </div>
    </main>
  )
}

export default App
