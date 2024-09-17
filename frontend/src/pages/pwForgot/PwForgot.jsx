import React, { useRef } from 'react';
import "./PwForgot.css";
import Footer from '../../components/footer/Footer';
import Topbar from '../../components/topbar/Topbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function PwForgot() {
    const email = useRef();

    //リダイレクトに使用
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        //入力されたアドレスにPW更新ページを送信

        const user = {
            email: email.current.value,
        }

        //APIを叩く
        const response = await axios.post("pre/pwForgot", user);
        console.log("pwForgotのresponse", response);

        if (response.data.success) {
            console.log("既に登録済みのようです");
            window.location.href = response.data.redirectTo;
        } else {
            //成功したらリダイレクト
            navigate("/PwUpdateLinkSend");
        }

    }

    return (
        <>
            <Topbar />
            <div className="pwForgotContainer">
                <form className='pwForgotWrapper'
                    onSubmit={(e) => handleSubmit(e)} >
                    <h1>パスワード更新</h1>
                    <div className="peForgotText">
                        パスワードを更新するため、アカウントに登録されているメールアドレスを入力してください。</div>

                    <div className="pwForgotEmail">
                        <h2>メールアドレス</h2>
                        <input
                            className="pwForgotUserInfo"
                            type='email'
                            required
                            ref={email}
                        />
                    </div>

                    <div className="pwForgotBtns">
                        <button className='pwForgotSubmit btn'>送信</button>
                    </div>
                </form>
            </div>
            <Footer />

        </>
    );
}
