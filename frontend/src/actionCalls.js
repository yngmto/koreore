import axios from "axios";
import { toast } from "react-toastify";

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
        toast.success("ログイン成功", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: {
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                border: "1px solid #00B8A9",
            }
        });
        dispatch({
            type: "LOGIN_SUCCESS", payload: response.data
        });
    } catch (err) {
        //通知を表示
        toast.error("メールアドレスかパスワードが違います", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

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

        toast.success("プロフィール更新完了", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: {
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                border: "1px solid #00B8A9",
            }
        });
        dispatch({ type: "UPDATE_USER", payload: response.data });
    } catch (err) { //エラーがあればエラーの通知を出す
        return console.log(err);
    }
}

//ログアウト
export const logoutCall = async (user, dispatch) => {
    // console.log("logoutCallに到達しました");

    try {
        toast.success("ログアウト完了", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: {
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                border: "1px solid #00B8A9",
            }
        });
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
        dispatch({ type: "DELETE_USER", payload: user });
    } catch (err) { //エラーがあればエラーの通知を出す
        return console.log(err);
    }
}