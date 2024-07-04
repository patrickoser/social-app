import { Route, Routes, BrowserRouter as Router } from "react-router-dom"
import Signup from "./pages/Signup.jsx"
import Login from "./pages/Login.jsx"
import LoginSignupHub from "./pages/LoginSignupHub.jsx"
import Header from "./components/Header.jsx"
import Footer from "./components/Footer.jsx"
import Settings from "./pages/Settings.jsx"
import Contact from "./pages/Contact.jsx"
import Profile from "./pages/Profile.jsx"
import Home from "./pages/Home.jsx"

function App() {

  return (
    <main>
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<LoginSignupHub />} />
          <Route path="home" element={<Home />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} /> 
          <Route path="settings" element={<Settings />} />
          <Route path="contact" element={<Contact />} />
          <Route path="profile" element={<Profile />} />
          <Route path="postpage" element={<PostPage />} />
        </Routes>
        <Footer />
      </Router>
    </main>
  )
}

export default App