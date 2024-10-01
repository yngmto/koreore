import React, { useContext, useRef, useState } from 'react';
import "./Edit.css";
import Topbar from '../../components/topbar/Topbar';
import Footer from '../../components/footer/Footer';
import { AuthContext } from '../../state/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { updateCall } from '../../actionCalls';
import { isValid, parse } from 'date-fns';

export default function Edit() {
    //グローバルコンテキストを使用
    const { user, dispatch } = useContext(AuthContext);
    const email = useRef();
    const year = useRef();
    const month = useRef();
    const day = useRef();
    const password = useRef(null);
    const passwordConfirmation = useRef(null);
    const [gender, setGender] = useState(user.gender);
    const navigate = useNavigate();


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

        if (currentYear - yearNum < 18) {
            return '18歳未満は登録できません';
        }

        return null; // エラーがない場合はnullを返す
    };

    //Submitボタンを押したときの処理
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
            // console.log("パスワードクリア")
        } else {
            try {
                //日付をDate型にする
                const date = new Date(year.current.value, month.current.value - 1, day.current.value);

                //渡すデータ
                const updateData = {
                    email: email.current.value,
                    gender: gender,
                    birthday: date,
                    userId: user._id,
                }

                //PWもあるなら追加
                if (password.current.value) {
                    updateData.password = password.current.value;
                }

                updateCall(
                    updateData,
                    dispatch
                );

                //成功したらリダイレクト
                navigate("/profile");
            } catch (err) {
                console.assert(err);
            }
        }
    }




    const date = new Date(user.birthday);

    return (
        <><Topbar />
            <div className='editContainer'>
                <form className="editWrapper" onSubmit={(e) => handleSubmit(e)}>
                    <h1>プロフィール編集</h1>
                    <h2>メールアドレス</h2>
                    <input className="editUserInfo" type='email' defaultValue={user.email} ref={email}></input>
                    <h2>性別</h2>
                    <div className="editUserInfo editGender">
                        <label>
                            <input
                                type="radio"
                                value="男性"
                                name="gender"
                                onChange={e => setGender(e.target.value)}
                                defaultChecked={user.gender === "男性"}
                            />
                            男性
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="女性"
                                name="gender"
                                onChange={e => setGender(e.target.value)}
                                defaultChecked={user.gender === "女性"} />
                            女性
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="未回答"
                                name="gender"
                                onChange={e => setGender(e.target.value)}
                                defaultChecked={user.gender === "未回答"} />
                            未回答
                        </label>
                    </div>
                    <h2>生年月日</h2>
                    <div className="editUserInfo editBirthday">
                        <input className='editYear' required ref={year} defaultValue={date.getFullYear()} />
                        <span>年</span>
                        <input className='editMonth' required ref={month} defaultValue={date.getMonth() + 1} />
                        <span>月</span>
                        <input className='editDay' required ref={day} defaultValue={date.getDate()} />
                        <span>日</span>
                    </div>
                    <h2>新規パスワード</h2>
                    <input className="editUserInfo" type='password' ref={password}></input>
                    <h2>新規パスワード確認</h2>
                    <input className="editUserInfo" type='password' ref={passwordConfirmation}></input>


                    <div className="editBtnsWrapper">
                        <Link to="/profile"><button className='editBack btn'>戻る</button></Link>
                        <button className='editSubmit btn' type='submit'>確定</button>

                    </div>
                </form>
                <script src="../../public/script.js"></script>
            </div>
            <Footer /></>

    )
}
