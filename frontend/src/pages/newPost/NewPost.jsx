import React, { useContext, useEffect, useRef, useState } from 'react'
import "./NewPost.css";
import Topbar from '../../components/topbar/Topbar';
import Footer from '../../components/footer/Footer';
import { AuthContext } from '../../state/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


export default function NewPost() {
  const API_URL = process.env.REACT_APP_API_URL;
  const { user } = useContext(AuthContext);
  const desc = useRef(null);
  const [inputNum, setInputNum] = useState(140);
  const navigate = useNavigate();

  //入力可能文字数
  useEffect(() => {
    const inputChars = desc.current;
    const updateInputNum = () => {
      const currentLength = desc.current.value.length;
      setInputNum(140 - currentLength);
    }

    //addEventListenerを使えば特定のイベント発生時に関数を実行できる
    inputChars.addEventListener('input', updateInputNum);

    return () => {
      //上記で追加されたイベントリスナーを削除(メモリリーク対策)
      inputChars.removeEventListener('input', updateInputNum);
    }
  }, []);

  const handleSubmit = async (e) => {
    // console.log("ポストのhandleが発火");
    e.preventDefault();

    if (desc.current.value.length <= 10) {
      toast.error('10文字以上入力してください', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '1px solid #F6416C',
        }
      })
      return;
    };

    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };

    try {
      await axios.post(`${API_URL}/posts`, newPost);
      toast.success('投稿完了', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '1px solid #00B8A9',
        }
      });
      navigate("/");

    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Topbar />
      <div className='newPostContainer'>
        <div className="newPostwrapper">
          <h1>ポスト作成</h1>
          <form className="inputText"
            onSubmit={(e) => handleSubmit(e)}>
            <textarea
              className="postInput"
              type='textarea'
              placeholder="ここに入力してください"
              maxLength={140}
              ref={desc}></textarea>
          </form>
          <div className="strNum">あと{inputNum}文字</div>
          <div className="postBtns">
            <form onSubmit={(e) => handleSubmit(e)}>
              <button className='postButton btn' type="submit">投稿</button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}