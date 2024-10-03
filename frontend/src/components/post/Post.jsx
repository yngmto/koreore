import React, { useContext, useEffect, useState } from "react"
import "./Post.css";
import axios from "axios";
import { format } from "timeago.js";
import * as timeago from "timeago.js";
import ja from "timeago.js/lib/lang/ja";
import { AuthContext } from "../../state/AuthContext";
timeago.register("ja", ja);


export default function Post({ post }) {
  const API_URL = process.env.REACT_APP_API_URL;

  //ログインユーザー
  const { user: currentUser } = useContext(AuthContext);
  //投稿ユーザー
  const [user, setUser] = useState({});
  ///---投稿userを取得---
  useEffect(() => {
    // console.log("投稿ユーザーを取得します");
    const fetchUser = async () => {
      const postUser = await axios.get(`${API_URL}/users/post/${post.userId}`);
      // console.log("投稿ユーザーを取得できてる？", postUser.data);
      setUser(postUser.data);

    }
    fetchUser();
  }, []);

  //「う～ん」ボタン
  const [warui, setWarui] = useState(post.warui ? post.warui.length : 0);
  const [isWarui, setIsWarui] = useState(() => {
    if (!currentUser) return false;
    return post.warui.includes(currentUser?._id)
  });

  //「わるくない」ボタン
  const [warukunai, setWarukunai] = useState(post.warukunai ? post.warukunai.length : 0);
  const [isWarukunai, setIsWarukunai] = useState(() => {
    if (!currentUser) return false;
    return post.warukunai.includes(currentUser?._id)
  });

  //グラフ
  const [graphOn, setGraphOn] = useState(isWarui || isWarukunai);

  //未ログイン時に評価ボタンを押したときモーダル
  const [nulluserModal, setNulluserModal] = useState(false);
  const nulluserModalHandle = (e) => {
    e.preventDefault();
    //ログイン済みなら無視
    if (currentUser) { return };
    // console.log("nulluserModalHandleが発火");
    setNulluserModal(!nulluserModal);
  }



  //---「う～ん」押下---
  const handleWarui = async () => {
    try {
      if (!currentUser) {
        // console.log("ログインしてください");
        return;
      }

      //う～んのAPIを叩く useIdとpostIdを渡す
      const response = await axios.put(`${API_URL}/posts/${post?._id}/warui`, { userId: currentUser?._id });

      // if (response.data.success) {
      setWarui(isWarui ? warui - 1 : warui + 1);
      setIsWarui(!isWarui);
      // console.log("isWarui:", !isWarui);
      if (!graphOn) { //初めての押下のときにtrueにする
        setGraphOn(true);
        // console.log("初めての評価です");
      }
      // }
    } catch (err) {
      // console.log("う～んボタンでerrが発生", err)
    }
  }

  //---「わるくない」押下---
  const handleWarukunai = async () => {
    if (!currentUser) {
      // console.log("ログインしてください");
      return;
    }

    try {
      const response = await axios.put(`${API_URL}/posts/${post?._id}/warukunai`, { userId: currentUser?._id });
      // if (response.data.success) {
      setWarukunai(isWarukunai ? warukunai - 1 : warukunai + 1);
      setIsWarukunai(!isWarukunai);
      if (!graphOn) { //初めての押下のときにtrueにする
        setGraphOn(true);
        // console.log("graphOn : ", graphOn);
      }
      // }
    } catch (err) {
      // console.log("わるくないボタンでerrが発生", err);
    }


  }

  //---割合計算---
  //ボタンを押す余地を残すため、少なくとも「5」%の割合を保証する
  // const minRatio = 5;
  // const [sum, setSum] = useState(warui + warukunai); //評価数
  // const [waruiRatio, setWaruiRatio] =
  // useState(sum !== 0 ? (warui / sum) * 100 : minRatio); //「う～ん」の割合(%)
  // const [warukunaiRatio, setWarukunaiRatio] =
  // useState(sum !== 0 ? (warukunai / sum) * 100 : minRatio); //「わるくない」の割合(%)


  // //１：評価数に変更があるたびにsumを計算
  // useEffect(() => {
  //   console.log("---評価数が変更されました---", warukunai, warui);
  //   setSum(warui + warukunai); //sumを計算
  // }, [warui, warukunai]);

  //２：sumに変更があるたびにRatioを計算
  // useEffect(() => {
  //   console.log("---sumが変更されました---", sum);

  //   //まず両方の値を計算する
  //   const waruiX = sum !== 0 ? (warui / sum) * 100 : minRatio;
  //   const warukunaiX = sum !== 0 ? (warukunai / sum) * 100 : minRatio
  //   // console.log("そのまま計算した値 :", waruiX, warukunaiX)

  //   //両方minRatio以下の場合(初期値の場合)
  //   if (waruiX <= minRatio && waruiRatio <= minRatio) {
  //     //評価数の多いほうに95を代入
  //     if (warui > warukunai) {
  //       setWarukunaiRatio(minRatio);
  //       setWaruiRatio(100 - minRatio);
  //     } else {
  //       setWaruiRatio(minRatio);
  //       setWarukunaiRatio(100 - minRatio);
  //     }

  //     //片方だけがminRatio以下の場合
  //   } else if (waruiX < minRatio) {
  //     // console.log("waruiX <= minRatio");
  //     setWaruiRatio(minRatio);
  //     setWarukunaiRatio(100 - minRatio);
  //   } else if (warukunaiX < minRatio) {
  //     // console.log("warukunaiX <= minRatio");
  //     setWarukunaiRatio(minRatio);
  //     setWaruiRatio(100 - minRatio);
  //     //どちらもminRatioより高い場合は、そのまま代入する
  //   } else {
  //     // console.log("どちらもminRatioより高い");
  //     setWarukunaiRatio(warukunaiX);
  //     setWaruiRatio(waruiX);
  //   }
  // }, [sum]);

  //---グラフ表示---
  // const [leftStyle, setLeftStyle] = useState({});
  // const [leftWidth, setLeftWidth] = useState(minRatio);
  // const [rightStyle, setRightStyle] = useState({});
  // const [rightWidth, setRightWidth] = useState(minRatio);

  // //３：Ratioに変更があるたびにStyleを計算
  // useEffect(() => {
  //   setRightWidth(waruiRatio + "%");
  // }, [waruiRatio]);

  // useEffect(() => {
  //   setLeftWidth(warukunaiRatio + "%");
  // }, [warukunaiRatio]);

  //評価ボタン更新後の処理
  useEffect(() => {
    if (!currentUser) { return; }

    //もし両方がtrueなら「わるい」をfalseにする
    if (isWarukunai && isWarui) {
      setIsWarui(!isWarui);
      setWarui(warui - 1);
    }
  }, [isWarukunai]);
  useEffect(() => {
    if (!currentUser) { return; }

    //もし両方がtrueなら「わるくない」をfalseにする
    if (isWarukunai && isWarui) {
      setIsWarukunai(!isWarukunai);
      setWarukunai(warukunai - 1);
    }
  }, [isWarui]);

  //userの年齢計算
  let age = "…";
  if (user && user.birthday) {
    const today = new Date();
    const birthDate = new Date(user.birthday)
    age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  }

  //削除モーダル
  const [modal, setModal] = useState(false);
  //削除モーダルのhandle
  const modalHandle = (e) => {
    e.preventDefault();  // フォームのデフォルトの送信動作を防ぐ
    // console.log("modalHandleが発火");
    setModal(!modal);
  }

  //ポスト削除のhandle
  const deleteHandleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.delete(`${API_URL}/posts`, {
        params: {
          id: post?._id,
          userId: currentUser?._id
        }
      });

      // console.log("削除：",response);


      //元のページにリダイレクト
      window.location.reload();

    } catch (err) {
      console.log(err);
    };


  }




  return (
    <>
      <div className="postContainer">
        <div className="postWrapper">

          {/* 削除モーダル */}
          <div className="modal-overlay"
            style={{
              display: modal ? "block" : "none"
            }}></div>
          <div className="modalWindow"
            style={{
              display: modal ? "block" : "none"
            }}>
            <div className="modal-content">
              投稿を削除しますか？
            </div>
            <div className="modalBtns">
              <form onSubmit={(e) => modalHandle(e)}>
                <button className="deleteCloseBtn btn">戻る</button></form>
              <form onSubmit={(e) => deleteHandleSubmit(e)}>
                <button className="deleteConfirmBtn btn">削除</button></form>
            </div>
          </div>

          {/* nulluserモーダル */}
          <div className="modal-overlay"
            style={{
              display: nulluserModal ? "block" : "none"
            }}></div>
          <div className="modalWindow"
            style={{
              display: nulluserModal ? "block" : "none"
            }}>
            <div className="modal-content">
              評価するにはログインする必要があります。
            </div>
            <div className="modalBtns">
              <form onSubmit={(e) => nulluserModalHandle(e)}>
                <button className="deleteCloseBtn btn">戻る</button></form>
            </div>
          </div>

          <div className="timelinePost">
            <div className="postTop">
              <div className="postTime">{format(post.createdAt, "ja")}</div>
              <div className="userInfo">
                <span>{age}歳 </span>
                <span>{user.gender !== "未回答" ? user.gender : null}</span>
              </div>

              {currentUser?._id === post.userId
                ? <form onSubmit={(e) => modalHandle(e)}>
                  <button className="fa-solid fa-trash-can"></button>
                </form>
                : null}

            </div>
            <div className="postText">{post.desc}</div>
            <div className="ratingBtns">
              <form onSubmit={(e) => nulluserModalHandle(e)}>
                <button
                  className="warukunai ratingBtn btn"
                  onClick={() => handleWarukunai()}
                >{graphOn ? <p>{warukunai}</p> : <p>{"わるくない"}</p>}</button>
                <button className="warui ratingBtn btn"
                  onClick={() => handleWarui()}
                >{graphOn ? <p>{warui}</p> : <p>{"う～ん"}</p>}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}