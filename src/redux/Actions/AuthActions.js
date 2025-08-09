
import { useGetDataWithToken } from "../../hooks/UseGetData";
import { useInsetData } from "../../hooks/UseInsertData";
import { CREATE_USER, FORGET_PASSWORD, GET_LOGGED_IN_USER, LOGIN_USER, RESET_PASSWORD, VERIFY_CODE } from "../Type";



export const loginUser = (data) => async (dispatch) => {
    try {
        const response = await useInsetData("/api/auth/login", data);
        return dispatch({
            type: LOGIN_USER,
            payload: response,
            loading: true
        });
    } catch (error) {
        console.error('Login error:', error);
        
        // Enhanced error handling for login
        let errorPayload = null;
        
        if (error.response) {
            // Server responded with error status
            errorPayload = {
                status: error.response.status,
                data: error.response.data
            };
        } else if (error.request) {
            // Request made but no response
            errorPayload = {
                status: 500,
                data: {
                    message: "لا يمكن الاتصال بالخادم، يرجى التحقق من الاتصال بالإنترنت"
                }
            };
        } else {
            // Other error
            errorPayload = {
                status: 500,
                data: {
                    message: "حدث خطأ في الاتصال بالخادم"
                }
            };
        }
        
        return dispatch({
            type: LOGIN_USER,
            payload: errorPayload,
            loading: false
        });
    }
}


export const createUser= (data)=> async(dispatch)=>{
    try{
        const response=await useInsetData("/api/auth/signup",data);
        dispatch({
            type:CREATE_USER,
            payload:response,
            loading:true,
        })

    }
    catch(e){
        console.error('Signup error:', e);
        
        // Enhanced error handling
        let errorPayload = null;
        
        if (e.response) {
            // Server responded with error status
            errorPayload = {
                status: e.response.status,
                data: e.response.data
            };
        } else if (e.request) {
            // Request made but no response
            errorPayload = {
                status: 500,
                data: {
                    message: "لا يمكن الاتصال بالخادم، يرجى التحقق من الاتصال بالإنترنت"
                }
            };
        } else {
            // Other error
            errorPayload = {
                status: 500,
                data: {
                    message: "حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى"
                }
            };
        }
        
        dispatch({
            type: CREATE_USER,
            payload: errorPayload,
            loading: false
        })
    }
}


export const forgetPassword = (data) => async (dispatch) => {
    try {
        const response = await useInsetData(`/api/auth/forgetPassword`, data);
        return dispatch({
            type: FORGET_PASSWORD,
            payload: response,
            loading: true
        });
    } catch (error) {
        return dispatch({
            type: FORGET_PASSWORD,
            payload: {
                status: error.response?.status,
                message: error.response?.data?.message || "حدث خطأ غير متوقع"
            },
            loading: false
        });
    } 
}


export const verifyCode=(data)=>async(dispatch)=>{
    try{
        const response=await useInsetData(`/api/auth/verifyResetCode`,data);
        return dispatch({
            type:VERIFY_CODE,
            payload: {
                status: response.status,
                data: response.data,
                message: response.data?.message
            },
            loading:true
        })
    }
    catch(e){
        return dispatch({
            type:VERIFY_CODE,
            payload: {
                status: e.response?.status,
                data: e.response?.data,
                message: e.response?.data?.message || "حدث خطأ غير متوقع"
            },
            loading:false
        })
    }
}



export const resetPassword=(data)=>async(dispatch)=>{
    try{
         const response=await useInsetData(`/api/auth/resetPassword`,data);
         return dispatch({
            type:RESET_PASSWORD,
            payload: {
                status: response.status,
                data: response.data,
                message: response.data?.message
            },
            loading:true
         })
    }
    catch(e){
        return dispatch({
            type:RESET_PASSWORD,
            payload: {
                status: e.response?.status,
                data: e.response?.data,
                message: e.response?.data?.message || "حدث خطأ غير متوقع"
            },
            loading:false
        })
    }
}


export const getLoggedInUser=async(dispatch)=>{
    try{
        const response=await useGetDataWithToken("/api/user/getme");
        return dispatch({
            type:GET_LOGGED_IN_USER,
            payload:response,
            loading:true
        })
    }
    catch(e){
        return dispatch({
            type:GET_LOGGED_IN_USER,
            payload:e.response,
            loading:false
        })
    }
}