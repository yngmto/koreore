import React, { useContext, useRef } from 'react';
import "./Login.css";
import Footer from '../../components/footer/Footer';
import Topbar from '../../components/topbar/Topbar';
import { loginCall } from "../../actionCalls";
import { AuthContext } from '../../state/AuthContext';
import { Link } from 'react-router-dom';

export default function Login() {
    const email = useRef();
    const password = useRef();
    //グローバルコンテキストを使用
    const {user, dispatch} = useContext(AuthContext);

    //submitしたときに実行する内容
    const handleSubmit = (e) => {
        e.preventDefault();
        loginCall(
            {   //この二つがuserとしてactionCallsに渡される
                email: email.current.value,
                password: password.current.value,
            },
            dispatch //これは第二引数
        );
    };

    return (
        <>
            <Topbar />
            <div className="loginContainer">
                <form className='loginWrapper'
                     onSubmit={(e) => handleSubmit(e)} >
                    <h1>ログイン</h1>
                    <h2>メールアドレス</h2>
                    <input
                        className="loginUserInfo"
                        type='email'
                        required
                        ref={email}
                    />
                    <h2>パスワード</h2>
                    <input
                        className="loginUserInfo"
                        type='password'
                        required
                        minLength="6"
                        ref={password}
                    />


                <div className="loginBtns">
                    <button className='loginSubmit btn'>ログイン</button>
                    <Link to ="/pwForgot" >
                    <button className="passwordForget btn">
                        パスワードを忘れてしまった方はこちら
                    </button>
                    </Link>
                </div>
                </form>
            </div>
            <Footer />

        </>
            );
}
