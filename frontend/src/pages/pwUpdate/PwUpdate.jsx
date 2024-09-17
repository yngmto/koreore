import React, { useRef } from 'react';
import "./PwUpdate.css";
import Topbar from '../../components/topbar/Topbar';
import Footer from '../../components/footer/Footer';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function PwUpdate() {
    const password = useRef();
    const passwordConfirmation = useRef();

    //PreUser情報を受け取る
    //最初に?以降のクエリパラメータを解析
    const params = new URLSearchParams(window.location.search);
    //"user"キーに対応する値を取得
    const encodeUser = params.get("user");
    const decodeUser = JSON.parse(atob(decodeURIComponent(encodeUser)));

    //リダイレクトに使用
    const navigate = useNavigate();


    //submitしたときに実行する内容
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("更新ボタン押下");

        //PWと確認用PWが合っているか確認
        if (password.current.value !== passwordConfirmation.current.value) {
            //setCustomValidity() ←あっているか自動で検出する関数
            passwordConfirmation.current.setCustomValidity("パスワードが違います");
        } else {
            try {
                const user = {
                    email: decodeUser.email,
                    password: password.current.value,
                }

                const updatedUser = await axios.put(`/users/pwUpdate${decodeUser._id}`,user);

                console.log("updatedUser",updatedUser);

                //成功したらpreUserを削除する
                await axios.delete("/pre/delete", {
                    data: { email: decodeUser.email }
                });

                //成功したらリダイレクト
                navigate("/");
            } catch (err) {
                console.log(err);
            }
        }
    }

    return (<>
        <Topbar />
        <div className='registerContainer'>

            <form className="registerWrapper"
                onSubmit={(e) => handleSubmit(e)}>
                <h1>パスワード更新</h1>
                <h2>新規パスワード</h2>
                <input
                    className="regsterUserInfo"
                    type='password'
                    required
                    minLength="6"
                    ref={password}
                />
                <h2>新規パスワード(確認)</h2>
                <input
                    className="regsterUserInfo"
                    type='password'
                    required
                    minLength="6"
                    ref={passwordConfirmation}
                />
                <div className="registerBtns">
                    <button className='registerSubmit btn' type="submit">更新</button>
                </div>
            </form>
        </div>
        <Footer />
    </>
    )
}
