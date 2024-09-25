import React, { useContext, useEffect, useState } from 'react'
import "./Profile.css";
import Footer from '../../components/footer/Footer';
import Topbar from '../../components/topbar/Topbar';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../state/AuthContext';
import { deleteCall, logoutCall } from '../../actionCalls';
import Post from '../../components/post/Post';
import axios from 'axios';

export default function Profile() {
  const API_URL = process.env.REACT_APP_API_URL;
  const { user, dispatch } = useContext(AuthContext);

  //日付
  const date = new Date(user.birthday);
  const navigate = useNavigate();

  //myPostを取得
  const [mypost, setMypost] = useState(null);
  useEffect(() => {
    const fetchMypost = async () => {
      try {
        const response = await axios.get(`${API_URL}/posts/mypost/${user._id}`);
        setMypost(response.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchMypost();
  }, [user._id]);

  //モーダル
  const [modal, setModal] = useState(false);

  //モーダルのhandle
  const modalHandle = (e) => {
    e.preventDefault();  // フォームのデフォルトの送信動作を防ぐ
    console.log("modalHandleが発火");
    setModal(!modal);
  }

  //ログアウトのhandle
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("ログアウトが発火");

    logoutCall(null, dispatch);

    //成功したらリダイレクト
    navigate("/");
  }

  //退会のhandle
  const deleteHandleSubmit = async (e) => {
    e.preventDefault();
    // console.log("退会を開始します");

    deleteCall({ userId: user._id }, dispatch);

    //成功したらリダイレクト
    navigate("/");
  }

  //エラーバウンダリー
  class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
      // エラーログを記録するなどの処理をここに書くことができますわ
    }

    render() {
      if (this.state.hasError) {
        return <h1>申し訳ございません。何か問題が発生いたしましたわ。</h1>;
      }

      return this.props.children;
    }
  }

  return (<><Topbar />
    <div className='profileContainer'>
      <div className="profileWrapper">

        {/* モーダル */}
        <div className="modal-overlay"
          style={{
            display: modal ? "block" : "none"
          }}></div>
        <div className="modalWindow"
          style={{
            display: modal ? "block" : "none"
          }}>
          <div className="modal-content">
            退会すると全ての投稿が削除され、二度と復元できません。<br></br>
            本当に退会しますか？
          </div>
          <div className="modalBtns">
            <form onSubmit={(e) => modalHandle(e)}>
              <button className="deleteCloseBtn btn">戻る</button></form>
            <form onSubmit={(e) => deleteHandleSubmit(e)}>
              <button className="deleteConfirmBtn btn">退会</button></form>
          </div>
        </div>


        <h1>プロフィール</h1>
        <h2>メールアドレス</h2>
        <div className="profileUserInfo">{user.email}</div>
        <h2>性別</h2>
        <div className="profileUserInfo">{user.gender}</div>
        <h2>生年月日</h2>
        <div className="profileUserInfo">{date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate()}</div>
        <h2>パスワード</h2>
        <div className="profileUserInfo profilePw">●●●●●●</div>
      </div>
      <Link to="/edit">
        <button className='profileEdit btn'>編集</button>
      </Link>

      <div className="profileMypostsWrapper">
        <h1>ポスト</h1>
        <ErrorBoundary>
          {mypost ? <Post post={mypost} /> : <p>まだ投稿がありません</p>}
        </ErrorBoundary>
        <Link to="/myposts">
          <button className='profileMypostsMore btn'>もっと見る</button>
        </Link>
      </div>

      <div className="profileBtns">
        <form onSubmit={(e) => handleSubmit(e)}>
          <button className='profileLogout btn' type='submit'>ログアウト</button>
        </form>
        {/* <button className='profileContactBtn btn'>お問い合わせ</button> */}
        <form onSubmit={(e) => modalHandle(e)}>
          <button className='profileDelete btn'>退会</button>
        </form>
      </div>
    </div>
    <Footer /></>
  )
}
