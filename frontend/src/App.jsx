import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Register from "./pages/register/Register.jsx";
import Login from "./pages/login/Login.jsx";
import Feed from "./pages/feed/Feed.jsx";
import Profile from "./pages/profile/Profile.jsx";
import PostPage from "./pages/post/PostPage.jsx";
import Settings from "./pages/settings/Settings.jsx";
import EditProfile from "./pages/EditProfile/EditProfile.jsx";
import LikedPosts   from "./pages/likedPosts/likedPosts.jsx";
import FriendsPage from "./pages/friends/Friends.jsx";
import Notifications from "./pages/notifications/Notifications.jsx";
import PendingRelationshipPage from "./pages/pendingRelationship/PendingRelationship.jsx";
import InterceptorError from "./components/auth/InterceptorError.jsx";
import SessionExpiredHandler from "./components/auth/SessionExpiredHandler.jsx";

function App() {
  return (
      <BrowserRouter>
          <InterceptorError>
              <SessionExpiredHandler>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/feed" element={<Feed />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/:id" element={<Profile />} />
                    <Route path="/post/:id" element={<PostPage />} />
                    <Route path="/EditProfile" element={<EditProfile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/likedPosts" element={<LikedPosts />} />
                    <Route path = "/friends" element={<FriendsPage/>} />
                    <Route path = "/notifications" element={<Notifications/>} />
                    <Route path = "/pendingRelationship" element={<PendingRelationshipPage/>} />
                </Routes>
              </SessionExpiredHandler>
          </InterceptorError>
      </BrowserRouter>
  )
}

export default App;
