import Profile from "./pages/profile/Profile";
import Myposts from "./pages/myposts/Myposts";
import PreRegister from "./pages/preRegister/PreRegister";
import PreUserExist from "./pages/preUserExist/PreUserExist";
import PreRegisted from "./pages/preRegisted/PreRegisted";
import Registered from "./pages/registered/Registered";
import Register from "./pages/register/Register";
import PwForgot from "./pages/pwForgot/PwForgot";
import PwUpdate from "./pages/pwUpdate/PwUpdate";
import PwUpdateLinkSend from "./pages/pwUpdateLinkSend/PwUpdateLinkSend";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Post from "./components/post/Post";
import { useContext } from "react";
import { AuthContext } from "./state/AuthContext";
import NewPost from "./pages/newPost/NewPost";
import Edit from "./pages/edit/Edit";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


//メインコンポーネント
function App() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pwForgot" element={user ? <Navigate to="/" /> : <PwForgot />} />
          <Route path="/pwUpdateLinkSend" element={user ? <Navigate to="/" /> : <PwUpdateLinkSend />} />
          <Route path="/pwUpdate" element={user ? <Navigate to="/" /> : <PwUpdate />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/preRegister" element={user ? <Navigate to="/" /> : <PreRegister />} />
          <Route path="/preUserExist" element={user ? <Navigate to="/" /> : <PreUserExist />} />
          <Route path="/preRegisted" element={user ? <Navigate to="/" /> : <PreRegisted />} />
          <Route path="/registered" element={user ? <Navigate to="/" /> : <Registered/>} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" />} />
          <Route path="/myposts" element={user ? <Myposts /> : <Navigate to="/" />} />
          <Route path="/post" element={<Post />} />
          <Route path="/newPost" element={<NewPost />} />
          <Route path="/edit" element={user ? <Edit /> : <Navigate to="/" /> } />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
}

export default App;
