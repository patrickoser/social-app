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
import { ThemeProvider } from "./context/ThemeContext.jsx"
import { PrivateRoutes } from "./components/PrivateRoutes.jsx"

function App() {

  return (
    <main>
      <Router>
        <AuthProvider>
          <DataProvider>
            <ThemeProvider>
              <Header />
              <Routes>
                <Route element={<PrivateRoutes />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/profile/:username" element={<Profile />} />
                  <Route path="/post/:id" element={<PostPage />} />
                </Route>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/missing" element={<Missing />} />
              </Routes>
              <Footer />
            </ThemeProvider>
          </DataProvider>
        </AuthProvider>
      </Router>
    </main>
  )
}

export default App