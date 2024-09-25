import axios from "axios";

//ログインに関すること
export const loginCall = async (user, dispatch) => {
    const API_URL = process.env.REACT_APP_API_URL;
    console.log("---loginCallに到達---");
    //ログインを開始するよ～っていう通知
    dispatch({ type: "LOGIN_START" });
    try {
        //LOGIN_STARTが成功したら、ログインのAPIを叩く
        const response = await axios.post(`${API_URL}/auth/login`, user);
        //成功した通知を出す
        dispatch({ type: "LOGIN_SUCCESS", payload: response.data });
    } catch (err) { //エラーがあればエラーの通知を出す
        dispatch({ type: "LOGIN_ERROR", payload: err })
    }
}

//ユーザー情報更新
export const updateCall = async (user, dispatch) => {

    // console.log("actionCallsに到達しました");

    try {
        //updateのAPIを叩く
        const response = await axios.put(`users/${user.userId}`, user);
        // console.log(response.data);
        dispatch({ type: "UPDATE_USER", payload: response.data });
    } catch (err) { //エラーがあればエラーの通知を出す
        return console.log(err);
    }
}

//ログアウト
export const logoutCall = async (user, dispatch) => {

    console.log("logoutCallに到達しました");

    try {
        dispatch({ type: "LOGOUT_USER", payload: user });
    } catch (err) { //エラーがあればエラーの通知を出す
        return console.log(err);
    }
}

//退会
export const deleteCall = async (user, dispatch) => {
    // console.log("deleteCallに到達しました");

    //deleteのAPIを叩く
    await axios.delete(`users/${user.userId}`,{
        data: user
    });
    try {
        dispatch({ type: "DELETE_USER", payload: user });
    } catch (err) { //エラーがあればエラーの通知を出す
        return console.log(err);
    }
}