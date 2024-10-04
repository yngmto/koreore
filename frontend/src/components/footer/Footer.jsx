import React, { useContext } from "react"
import "./Footer.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../state/AuthContext";
import { errorToast } from "../../utils/globalFunctions";

export default function Footer() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClickNewpost = (e) => {
    e.preventDefault();
    if (!user) {
      errorToast("ログインしてください");
    }else{
      navigate("/newPost");
    }

  }
  const handleClickProfile = (e) => {
    e.preventDefault();
    if (!user) {
      errorToast("ログインしてください");
    }else{
      navigate("/profile");
    }

  }
  return (
    <footer className="footer-menu">
      <ul>
        <Link to="/"><li><i className="fa-regular fa-comment postIcon"></i></li></Link>
        <li className="plus" onClick={handleClickNewpost}><i className="fa-solid fa-plus"></i></li>
        <li onClick={handleClickProfile}><i className="fa-regular fa-user profileIcon"></i></li>
      </ul>
    </footer>
  )
}