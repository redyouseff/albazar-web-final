import { 
    SEND_MESSAGE, 
    GET_ALL_MESSAGES, 
    GET_USERS_FOR_SIDEBAR, 
    UPDATE_FCM_TOKEN,
    SET_SELECTED_USER,
    ADD_MESSAGE_REAL_TIME,
    UPDATE_SIDEBAR_REAL_TIME
} from "../Type";

const initialState = {
    messages: [],
    usersForSidebar: [],
    selectedUser: null,
    sendMessage: [],
    updateFCMToken: [],
    loading: false,
    error: null,
    shouldUpdateSidebar: false
};

const MessageReducer = (state = initialState, action) => {
    switch (action.type) {
        case SEND_MESSAGE:
            return {
                ...state,
                sendMessage: action.payload,
                loading: false,
                error: action.payload?.response?.data?.message || null
            };

        case GET_ALL_MESSAGES:
            const messagesData = action.payload?.data || action.payload;
            console.log("GET_ALL_MESSAGES:", messagesData);
            
            return {
                ...state,
                messages: Array.isArray(messagesData) ? messagesData : [],
                loading: false,
                error: action.payload?.response?.data?.message || null
            };

        case GET_USERS_FOR_SIDEBAR:
            return {
                ...state,
                usersForSidebar: action.payload?.data || action.payload,
                loading: false,
                error: action.payload?.response?.data?.message || null,
                shouldUpdateSidebar: false
            };

        case UPDATE_FCM_TOKEN:
            return {
                ...state,
                updateFCMToken: action.payload,
                loading: false,
                error: action.payload?.response?.data?.message || null
            };

        case SET_SELECTED_USER:
            return {
                ...state,
                selectedUser: action.payload
            };

        case ADD_MESSAGE_REAL_TIME:
            // Add message to current conversation
            const newMessage = action.payload;
            const currentMessages = Array.isArray(state.messages) ? state.messages : [];
            
            console.log("📨 MessageReducer: ADD_MESSAGE_REAL_TIME", {
                newMessageId: newMessage._id,
                newMessageText: newMessage.text,
                senderId: newMessage.senderId,
                receiverId: newMessage.receiverId,
                currentMessagesCount: currentMessages.length
            });
            
            // Check if message already exists to prevent duplicates
            const messageExists = currentMessages.some(msg => 
                msg._id && newMessage._id && String(msg._id) === String(newMessage._id)
            );
            
            if (messageExists) {
                console.log("⚠️ MessageReducer: Message already exists, skipping...", newMessage._id);
                return state;
            }
            
            const updatedMessages = [...currentMessages, newMessage];
            console.log("✅ MessageReducer: Message added successfully", {
                totalMessages: updatedMessages.length,
                addedMessageId: newMessage._id
            });
            
            return {
                ...state,
                messages: updatedMessages
            };

        case UPDATE_SIDEBAR_REAL_TIME:
            return {
                ...state,
                shouldUpdateSidebar: true
            };

        default:
            return state;
    }
};

export default MessageReducer; 