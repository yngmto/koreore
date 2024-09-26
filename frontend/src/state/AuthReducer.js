const AuthReducer = (state, action) => {
    switch(action.type) {
        case "LOGIN_START":
            return{
                user:null,
                isFetching: true,
                error: false,
            };
        case "LOGIN_SUCCESS":
            // console.log("LOGIN_SUCCESSに到達しました");
            return{
                user:action.payload,
                isFetching: false,
                error: false,
            };
        case "LOGIN_ERROR":
            return{
                user:null,
                isFetching: false,
                error: action.payload,
            };
        case "UPDATE_USER":
            console.log("UPDATE_USERに到達しました");
            return {
                user: action.payload,
                isFetching: false,
                error: false,
            };
        case "LOGOUT_USER":
            // console.log("LOGOUT_USERに到達しました");
            return {
                user: null,
                isFetching: false,
                error: false,
            };
        case "DELETE_USER":
            console.log("DELETE_USERに到達しました");
            return {
                user: null,
                isFetching: false,
                error: false,
            };
        default:
            return state;
    }
};

export default AuthReducer;
