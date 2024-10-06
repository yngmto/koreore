import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import "./Timeline.css";
import Post from "../post/Post";
import axios from "axios";

export default function Timeline({ userId }) {
  const [posts, setPosts] = useState([]); //表示するデータ
  const [hasMore, setHasMore] = useState(true);
  const [lastTime, setLastTime] = useState(null);
  const [message, setMessage] = useState("もっと読み込む");
  const observerTarget = useRef(null);
  const API_URL = process.env.REACT_APP_API_URL;

  //---TL読込---(useCallback ← 関数をメモ化)
  const fetchPosts = useCallback(async () => {
    try {
      //useridが渡されているなら自分の投稿を
      //そうでなければすべての投稿を取得
      const endpoint = userId
        ? `${API_URL}/posts/myposts/${userId}`
        : `${API_URL}/posts/timeline/all`;


      const response = await axios.get(endpoint, {
        //axiosは、これで自動的にクエリを構築する
        params: { lastTime: lastTime }
      });

      //取得した投稿をスプレッド構文で結合
      const newPosts = response.data;
      setPosts(prevPosts => [...prevPosts, ...newPosts]);

      //newPostsが空か、10件以下なら…
      if (!newPosts || newPosts.length < 10) {
        setHasMore(false);
      } else {
        //取得した中でいちばん後ろの投稿の作成日時をセット
        setLastTime(
          new Date(newPosts[newPosts.length - 1].createdAt)
            .toISOString() //文字列化（時間を世界共通の形式で記録）
        );
      }
    } catch (error) {
      console.error("投稿の取得中にエラーが発生しました:", error);
      setHasMore(false);
    }
  }, [userId, lastTime]); //依存配列が変更されたときに関数が再生成



  //---交差オブザーバー---
  useEffect(() => {
    //オブザーバーを作成
    const observer = new IntersectionObserver(

      //entries ← 監視対象の状態を表す配列
      entries => {
        //監視対象が画面に表示されている && hasMore
        if (entries[0].isIntersecting && hasMore) {
          fetchPosts();
        }
      },
      { threshold: 1 } //監視対象が100%表示されたら…
    );

    //監視対象の設定
    if (observerTarget.current) { //存在するなら…
      observer.observe(observerTarget.current); //監視対象に設定
    }

    //クリーンアップ(observer量産によるパフォーマンス低下防止)
    return () => observer.disconnect();
  }, [fetchPosts, hasMore]);

  //---最下部の文言---
  useEffect(() => {
    setMessage(hasMore
      ? <div className="tlStop">読み込み中です…</div>
      : <div className="tlStop">読み込める投稿がありません</div>
    );
  }, [hasMore]);

  return (
    <div className="timelineContainer">
      <div className="timelineWrapper">
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
        <div className="tlBottom">{message}</div>
        <div id="observerTarget" ref={observerTarget}></div>
      </div>
    </div>
  );
}