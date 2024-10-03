import React, { useRef, } from "react";
import "./PreRegister.css";
import Topbar from "../../components/topbar/Topbar";
import Footer from "../../components/footer/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PreRegister() {
    const API_URL = process.env.REACT_APP_API_URL;
    const email = useRef();

    //リダイレクトに使用
    const navigate = useNavigate();

    //submitしたときに実行する内容
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const user = { //どんな情報を持ったuserを登録するのか
                email: email.current.value,
            }

            //preRegisterAPIを叩く
            const response = await axios.post(`${API_URL}/pre/preRegister`, user);
            // console.log("preRegisterのresponse", response);
            // もし既に登録済ならリダイレクト
            if (response.data.success) {
                // console.log("既に登録済みのようです");
                window.location.href = response.data.redirectTo;
            } else {
                //成功したらリダイレクト
                navigate("/preRegisted");
            }

        } catch (err) {
            console.log(err);
        }
    }


    return (<>
        <Topbar />
        <div className="preRegisterContainer">

            <form className="preRegisterWrapper"
                onSubmit={(e) => handleSubmit(e)}>
                <h1>仮登録</h1>
                <div className="preEmailWrapper">
                    <h2 className="preH2">メールアドレス</h2>
                    <div className="preEmail">
                        <input
                            className="preRegsterUserInfo"
                            type="email"
                            required
                            ref={email}
                        />
                    </div>
                </div>
                <div className="preRegisterMessage">
                    認証用のメールをお送りします。<br></br>
                    24時間以内に、メール記載のURLから本登録にお進みください。
                </div>
                <div className="registerBtns">
                    <button className="registerSubmit btn" type="submit">送信</button>
                </div>
            </form>
        </div>
        <Footer />
    </>
    )
}