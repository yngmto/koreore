import React from 'react'
import "./Footer.css";
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer-menu">
      <ul>
          <Link to="/"><li><i className="fa-regular fa-comment postIcon"></i></li></Link>
          <Link to="/newPost"><li className="plus"><i className="fa-solid fa-plus"></i></li></Link>
          <Link to="/profile"><li><i className="fa-regular fa-user profileIcon"></i></li></Link>
      </ul>
    </footer>
  )
}
