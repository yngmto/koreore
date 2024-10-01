import React, { useContext, useRef, useState } from 'react';
import "./Register.css";
import Topbar from '../../components/topbar/Topbar';
import Footer from '../../components/footer/Footer';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { loginCall } from '../../actionCalls';
import { AuthContext } from '../../state/AuthContext';
import { isValid, parse } from 'date-fns';


export default function Register() {
    const API_URL = process.env.REACT_APP_API_URL;
    const email = useRef();
    const year = useRef();
    const month = useRef();
    const day = useRef();
    const password = useRef();
    const passwordConfirmation = useRef();
    const [gender, setGender] = useState("");

    //LoginCallに使用するグローバルコンテキストを使用
    const { dispatch } = useContext(AuthContext);

    //リダイレクトに使用
    const navigate = useNavigate();

    //PreUser情報を受け取る
    //最初に?以降のクエリパラメータを解析
    const params = new URLSearchParams(window.location.search);
    //"user"キーに対応する値を取得
    const encodeUser = params.get("user");
    const decodeUser = JSON.parse(atob(decodeURIComponent(encodeUser)));
    // console.log("decodeUser:",decodeUser);

    //生年月日のバリデーション
    const validateBirthday = (year, month, day) => {
        // 文字列を数値に変換
        const yearNum = parseInt(year, 10);
        const monthNum = parseInt(month, 10) - 1; // date-fnsは0-11の月を使用
        const dayNum = parseInt(day, 10);

        // 日付の妥当性をチェック
        const date = parse(`${yearNum}-${monthNum + 1}-${dayNum}`, 'yyyy-M-d', new Date());

        if (!isValid(date)) {
            return '無効な日付です';
        }

        const currentYear = new Date().getFullYear();
        if (currentYear - yearNum > 130) {
            return '130歳以上の年齢は無効です';
        }
        return null; // エラーがない場合はnullを返す
    };



    //submitしたときに実行する内容
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 生年月日のバリデーション
        const birthdayError = validateBirthday(
            year.current.value,
            month.current.value,
            day.current.value
        );

        if (birthdayError) {
            alert(birthdayError);
            return;
        }

        //PWと確認用PWが合っているか確認
        if (password.current.value !== passwordConfirmation.current.value) {
            //setCustomValidity() ←あっているか自動で検出する関数
            passwordConfirmation.current.setCustomValidity("パスワードが違います");
        } else {
            try {

                const date = new Date(year.current.value, month.current.value - 1, day.current.value);

                const user = { //どんな情報を持ったuserを登録するのか
                    email: email.current.value,
                    password: password.current.value,
                    gender: gender,
                    birthday: date,
                }

                //registerAPIを叩く
                await axios.post(`${API_URL}/auth/register`, user);

                //console.log("user:",user);

                //成功したらpreUserを削除する
                await axios.delete(`${API_URL}/pre/delete`, {
                    data:{email:user.email}
                });

                //loginAPIを叩く
                loginCall(
                    {   //この二つがuserとしてactionCallsに渡される
                        email: email.current.value,
                        password: password.current.value,
                    },
                    dispatch //これは第二引数
                );

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
                <h1>新規登録</h1>
                <h2>メールアドレス</h2>
                <input
                    className="regsterUserInfo registerEmail"
                    type='email'
                    required
                    ref={email}
                    value={decodeUser.email}
                />
                <h2>性別</h2>
                <div
                    className="regsterUserInfo registerGender">
                    <label>
                        <input
                            type="radio"
                            value="男性"
                            name="gender"
                            required
                            onChange={e => setGender(e.target.value)} />
                        男性
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="女性"
                            name="gender"
                            onChange={e => setGender(e.target.value)} />
                        女性
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="未回答"
                            name="gender"
                            onChange={e => setGender(e.target.value)} />
                        未回答
                    </label>
                </div>
                <h2>生年月日</h2>
                <div className="regsterUserInfo registerBirthday">
                    <input className='registerYear' required ref={year} />
                    <span>年</span>
                    <input className='registerMonth' required ref={month} />
                    <span>月</span>
                    <input className='registerDay' required ref={day} />
                    <span>日</span>
                </div>
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
                    <button className='registerSubmit btn' type="submit">登録</button>
                </div>
            </form>


        </div>
        <Footer />
    </>
    )
}
