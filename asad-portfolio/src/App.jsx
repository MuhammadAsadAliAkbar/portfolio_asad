import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Achievements from "./components/Achievements";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Education from "./components/Education";
import Footers from "./components/Footers";
import Knowledge from "./components/Knowledge";
import Chatbot from "./components/Chatbot";
import ClientAchievements from './components/ClientAchievements'
import MessageChat from "./components/MessageChat";
import LoginPopup from './components/Login'
import SignupPopup from './components/SignupPopup'
import GoogleMapPremium from './components/GoogleMapPremium'

function App() {
  const [count, setCount] = useState(0)

  return (
   <>
     <Navbar />

      <main>
        <Hero />
        <About />
        <Skills />
        <Knowledge />
        <Projects />
        <Experience />
        <Achievements />
        <Testimonials />
        <ClientAchievements />
        <Education />
        <GoogleMapPremium />
        <Contact />
      </main>
      <Footers />
      <Chatbot />
      <MessageChat />
      <LoginPopup />
      <SignupPopup />
      {/* <Footer /> */}
   </>
     
  )
}

export default App
