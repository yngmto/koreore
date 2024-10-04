import axios from "axios";
import { errorToast, successToast } from "./utils/globalFunctions";

//ログインに関すること
export const loginCall = async (user, dispatch) => {
    const API_URL = process.env.REACT_APP_API_URL;
    // console.log("---loginCallに到達---");
    //ログインを開始するよ～っていう通知
    dispatch({ type: "LOGIN_START" });
    try {
        //LOGIN_STARTが成功したら、ログインのAPIを叩く
        const response = await axios.post(`${API_URL}/auth/login`, user);
        //成功した通知を出す
        successToast("ログインしました");
        dispatch({
            type: "LOGIN_SUCCESS", payload: response.data
        });
    } catch (err) {
        //通知を表示
        errorToast("メールアドレスかパスワードが違います");
        dispatch({ type: "LOGIN_ERROR", payload: err })
    }
}

//ユーザー情報更新
export const updateCall = async (user, dispatch) => {
    const API_URL = process.env.REACT_APP_API_URL;

    // console.log("updateCallに到達しました");

    try {
        //updateのAPIを叩く
        const response = await axios.put(`${API_URL}/users/${user.userId}`, user);
        // console.log(response.data);

        successToast("プロフィールを更新しました");
        dispatch({ type: "UPDATE_USER", payload: response.data });
    } catch (err) { //エラーがあればエラーの通知を出す
        return console.log(err);
    }
}

//ログアウト
export const logoutCall = async (user, dispatch) => {
    // console.log("logoutCallに到達しました");
    try {
        successToast("ログアウトしました");
        dispatch({ type: "LOGOUT_USER", payload: user });
    } catch (err) { //エラーがあればエラーの通知を出す
        return console.log(err);
    }
}

//退会
export const deleteCall = async (user, dispatch) => {
    const API_URL = process.env.REACT_APP_API_URL;
    // console.log("deleteCallに到達しました");

    //deleteのAPIを叩く
    await axios.delete(`${API_URL}/users/${user.userId}`, {
        data: user
    });
    try {
        successToast("また、いつでもお待ちしております")
        dispatch({ type: "DELETE_USER", payload: user });
    } catch (err) { //エラーがあればエラーの通知を出す
        return console.log(err);
    }
}