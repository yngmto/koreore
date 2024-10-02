import React, { useCallback, useEffect, useRef, useState } from 'react'
import "./Timeline.css";
import Post from "../post/Post";
import axios from "axios";

export default function Timeline({ userId }) {
  const [posts, setPosts] = useState([]); //表示するデータ
  const [hasMore, setHasMore] = useState(true);
  const [lastTime, setLastTime] = useState(null);
  const [message, setMessage] = useState("もっと読み込む");
  const observerTarget = useRef(null);

  // console.log("TLのuserId:",userId);

  //---TL読込---
  const fetchPosts = useCallback(async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const endpoint = userId
        ? `${API_URL}/posts/myposts/${userId}`
        : `${API_URL}/posts/timeline/all`;
        //useridが渡されているなら自分の投稿を
        //そうでなければすべての投稿を取得

      const response = await axios.get(endpoint, {
        params: { lastTime: lastTime }
      });

      const newPosts = response.data;
      setPosts(prevPosts => [...prevPosts, ...newPosts]);

      if (!newPosts || newPosts.length < 10) {
        setHasMore(false);
      } else {
        setLastTime(new Date(newPosts[newPosts.length - 1].createdAt).toISOString());
      }
    } catch (error) {
      console.error("投稿の取得中にエラーが発生しました:", error);
      setHasMore(false);
    }
  }, [userId, lastTime]);

  //hasMoreの監視
  useEffect(() => {
    if (!hasMore) {
      //console.log("もうないです", hasMore);
    }
  }, [hasMore]);

  //---交差オブザーバー---
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          fetchPosts();
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [fetchPosts, hasMore]);

  //---最下部の文言---
  useEffect(() => {
    setMessage(hasMore
      ? <div className="tlStop">読み込み中です…</div>
      // <div className="fa-solid fa-angles-down tlUpdate"></div>
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