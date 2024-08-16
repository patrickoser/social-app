import { Route, Routes, BrowserRouter as Router } from "react-router-dom"

import Signup from "./pages/Signup.jsx"
import Login from "./pages/Login.jsx"
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
import { Protected } from "./components/Protected.jsx"

function App() {

  return (
    <main>
      <Router>
        <DataProvider>
          <AuthProvider>
            <Header />
            <Routes>
              <Route path='/' element={<Protected><Home /></Protected>} />
              <Route path="signup" element={<Signup />} />
              <Route path="login" element={<Login />} />
                <Route path="home" element={<Protected><Home /></Protected>} />
                <Route path="settings" element={<Protected><Settings /></Protected>} />
                <Route path="contact" element={<Protected><Contact /></Protected>} />
                <Route path="profile" element={<Protected><Profile /></Protected>} />
                <Route path="post/:id" element={<Protected><PostPage /></Protected>} />
                <Route path="missing" element={<Missing />} />
            </Routes>
            <Footer />
          </AuthProvider>
        </DataProvider>
      </Router>
    </main>
  )
}

export default App