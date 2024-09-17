import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

//ローカルストレージからuser情報を取得
const userData = localStorage.getItem("user");

//ユーザー状態を定義
const initialState = {
    //userDataがnullでなければ格納
    user: userData !== undefined ? JSON.parse(userData) : null,
    // user: null,
    isFetching: false,
    error: false,
};

//状態をグローバルに管理する
export const AuthContext = createContext(initialState);

export const AuthContextProvider = ({ children }) => {

    //stateは現在の状態 dispatchは、どういうactionを実行したか
    const [state, dispatch] = useReducer(AuthReducer, initialState)

    //user状態が変わったら発火するuseEffect
    useEffect( () => {
        // console.log("ローカルストレージのuser情報を下記に更新します");
        // console.log(state.user);
        localStorage.setItem("user", JSON.stringify(state.user));
    }, [state.user]);

    //Providerをつけることで、どこにでも提供可能になる
    //共有したい情報をvalueに入れる
    return <AuthContext.Provider value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
    }}>
        {/*Providerで囲われたもの(children)が、
            valueを全て使用可能になる*/}
        {children}
    </AuthContext.Provider>
};