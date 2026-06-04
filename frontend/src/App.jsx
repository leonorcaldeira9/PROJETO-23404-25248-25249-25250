import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Register from "./pages/register/Register.jsx";
import Login from "./pages/login/Login.jsx";
import Feed from "./pages/feed/Feed.jsx";
import Profile from "./pages/profile/Profile.jsx";
import PostPage from "./pages/post/PostPage.jsx";

function App() {
  return (
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/post/:id" element={<PostPage />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App;
