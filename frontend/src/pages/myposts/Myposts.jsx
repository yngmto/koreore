import React, { useContext } from "react";
import Topbar from "../../components/topbar/Topbar";
import Footer from "../../components/footer/Footer";
import Timeline from "../../components/timeline/Timeline";
import { AuthContext } from "../../state/AuthContext";
import "./Myposts.css";

export default function Myposts() {
  const {user} = useContext(AuthContext);
  const userId = user._id;
  // console.log("userId:",userId)
  return (
    <>
        <Topbar/>
        <h1 className="mypostsH1">マイポスト</h1>
        <Timeline userId={userId}/>
        <Footer/>
    </>
  )
}
