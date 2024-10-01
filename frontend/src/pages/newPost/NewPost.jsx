import React, { useContext, useEffect, useRef, useState } from 'react'
import "./NewPost.css";
import Topbar from '../../components/topbar/Topbar';
import Footer from '../../components/footer/Footer';
import { AuthContext } from '../../state/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


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

    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };

    try {
      await axios.post(`${API_URL}/posts`, newPost);
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
