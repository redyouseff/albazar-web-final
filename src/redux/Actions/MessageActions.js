import { useGetDataWithToken } from "../../hooks/UseGetData";
import { useInsetDataWithToken } from "../../hooks/UseInsertData";
import { useUdpateDataWithToken } from "../../hooks/UseUpdataData";
import { 
    SEND_MESSAGE, 
    GET_ALL_MESSAGES, 
    GET_USERS_FOR_SIDEBAR, 
    UPDATE_FCM_TOKEN,
    SET_SELECTED_USER,
    ADD_MESSAGE_REAL_TIME,
    UPDATE_SIDEBAR_REAL_TIME
} from "../Type";

// Send Message
export const sendMessage = (receiverId, data) => async (dispatch) => {
    try {
        const response = await useInsetDataWithToken(`/api/message/${receiverId}`, data);
        dispatch({
            type: SEND_MESSAGE,
            payload: response,
            loading: false
        });
        return response;
    } catch (error) {
        dispatch({
            type: SEND_MESSAGE,
            payload: error.response || error,
            loading: false
        });
        throw error;
    }
};

// Get Messages between two users
export const getMessages = (userId) => async (dispatch) => {
    try {
        const response = await useGetDataWithToken(`/api/message/${userId}`);
        dispatch({
            type: GET_ALL_MESSAGES,
            payload: response,
            loading: false
        });
    } catch (error) {
        dispatch({
            type: GET_ALL_MESSAGES,
            payload: error.response || error,
            loading: false
        });
    }
};

// Get Users for Sidebar (conversations list)
export const getUsersForSidebar = () => async (dispatch) => {
    try {
        const response = await useGetDataWithToken("/api/message/users");
        dispatch({
            type: GET_USERS_FOR_SIDEBAR,
            payload: response,
            loading: false
        });
    } catch (error) {
        dispatch({
            type: GET_USERS_FOR_SIDEBAR,
            payload: error.response || error,
            loading: false
        });
    }
};

// Update FCM Token
export const updateFCMToken = (fcmToken) => async (dispatch) => {
    try {
        const response = await useUdpateDataWithToken("/api/message/fcm-token", { fcmToken });
        dispatch({
            type: UPDATE_FCM_TOKEN,
            payload: response,
            loading: false
        });
    } catch (error) {
        dispatch({
            type: UPDATE_FCM_TOKEN,
            payload: error.response || error,
            loading: false
        });
    }
};

// Set Selected User for Chat
export const setSelectedUser = (user) => (dispatch) => {
    dispatch({
        type: SET_SELECTED_USER,
        payload: user
    });
};

// Add message in real-time (from socket)
export const addMessageRealTime = (message) => (dispatch) => {
    dispatch({
        type: ADD_MESSAGE_REAL_TIME,
        payload: message
    });
};

// Update sidebar in real-time (from socket)
export const updateSidebarRealTime = () => (dispatch) => {
    dispatch({
        type: UPDATE_SIDEBAR_REAL_TIME
    });
};
