
import { LOGIN_USER, CREATE_USER, FORGET_PASSWORD, VERIFY_CODE, RESET_PASSWORD, GET_LOGGED_IN_USER } from "../Type";

const initialState = {
    isAuthenticated: false,
    user: null,
    createuser: null,
    loading: false,
    forgetpassword: null,
    verifyCode: null,
    resetPassword: null,
    getLoggedInUser: null,
    error: null
};

const AuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_USER:
            return {
                ...state,
                isAuthenticated: action.payload?.data?.token ? true : false,
                user: action.payload || null,
                loading: false,
                error: action.payload?.response?.data?.message || null
            };
        case CREATE_USER:
            return {
                ...state,
                isAuthenticated: action.payload?.data?.token ? true : false,
                createuser: action.payload || null,
                loading: false,
                error: action.payload?.response?.data?.message || null
            };

            case FORGET_PASSWORD:
                return {
                    ...state,
                    isAuthenticated: action.payload?.data?.token ? true : false,
                    forgetpassword: action.payload || null,
                    loading: false,
                    error: action.payload?.response?.data?.message || null
                };
                case VERIFY_CODE:
                    return {
                        ...state,
                        isAuthenticated: action.payload?.data?.token ? true : false,
                        verifyCode: action.payload || null,
                        loading: false,
                        error: action.payload?.response?.data?.message || null
                    };
                    case RESET_PASSWORD:
                        return{
                            ...state,
                            resetPassword:action.payload || null,
                            loading:false,
                            error:action.payload?.response?.data?.message || null
                        }
                        case GET_LOGGED_IN_USER:
                            return{
                                ...state,
                                getLoggedInUser:action.payload || null,
                                loading:false,
                                error:action.payload?.response?.data?.message || null
                            }
        default:
            return state;
    }
};

export default AuthReducer; 