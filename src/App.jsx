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
import PostPage from "./pages/PostPage.jsx"
import Missing from "./pages/Missing.jsx"

import { DataProvider } from "./context/DataContext.jsx"
import { AuthProvider } from "./context/AuthContext.jsx"
import Protected from "./components/Protected.jsx"

function App() {

  return (
    <main>
      <Router>
        <DataProvider>
          <AuthProvider>
            <Header />
            <Routes>
              <Route path='/' element={<LoginSignupHub />} />
              <Route path="signup" element={<Signup />} />
              <Route path="login" element={<Login />} />
              <Protected>
                <Route path="home" element={<Home />} />
                <Route path="settings" element={<Settings />} />
                <Route path="contact" element={<Contact />} />
                <Route path="profile" element={<Profile />} />
                <Route path="post/:id" element={<PostPage />} />
                <Route path="missing" element={<Missing />} />
              </Protected>
            </Routes>
            <Footer />
          </AuthProvider>
        </DataProvider>
      </Router>
    </main>
  )
}

export default App