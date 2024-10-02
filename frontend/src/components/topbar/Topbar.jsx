import React, { useContext } from "react"
import "./Topbar.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../../state/AuthContext";

export default function Topbar() {

  //グローバルコンテキストを使用
  const { user } = useContext(AuthContext);

  return (
    <div className="topbarContainer">
      <div className="topbarWrapper">
        <div className="topbarLeft">
          <Link to="/" style={{ textDecoration: "none", color: "black" }}>
            <div className="logo">これ<br />おれが<br />わるいんか？</div>
          </Link>
        </div>

        {/* ログインしていない場合のみ表示 */}
        {user === null &&
          <div className="topbarRight">
            <Link to="/preRegister">
              <div className="registerBtn btn">新規登録</div></Link>
            <Link to="/login">
              <div className="loginBtn btn">ログイン</div></Link>
          </div>
        }


      </div>
    </div>
  )
}
