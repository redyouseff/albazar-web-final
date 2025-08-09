import { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    sendMessage, 
    getMessages, 
    getUsersForSidebar, 
    setSelectedUser,
    addMessageRealTime,
    updateSidebarRealTime
} from '../../redux/Actions/MessageActions';

export const useChatHook = () => {
    const dispatch = useDispatch();
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [sidebarLoading, setSidebarLoading] = useState(false);
    const [sendingMessage, setSendingMessage] = useState(false);
    
    const {
        messages,
        usersForSidebar,
        selectedUser,
        sendMessage: sendMessageResult,
        shouldUpdateSidebar,
        error
    } = useSelector(state => state.message);

    // Send a message
    const sendNewMessage = useCallback(async (receiverId, messageData) => {
        try {
            setSendingMessage(true);
            
            // Get current user for better logging
            const currentUser = (() => {
                try {
                    return JSON.parse(localStorage.getItem("user"));
                } catch {
                    return null;
                }
            })();
            
            console.log("📤 useChatHook: Sending message:", {
                text: messageData.text,
                fromUserId: currentUser?._id,
                toUserId: receiverId,
                timestamp: new Date().toLocaleTimeString()
            });
            
            const result = await dispatch(sendMessage(receiverId, messageData));
            console.log("📤 useChatHook: Send message result:", {
                status: result?.status,
                hasMessage: !!(result?.data?.message || result?.message),
                messageId: (result?.data?.message || result?.message)?._id
            });
            
            // إضافة الرسالة فوراً للمرسل (fallback حتى نحسن الباك إند)
            if (result?.data?.message || result?.message) {
                const message = result?.data?.message || result?.message;
                console.log("🔄 useChatHook: Adding sent message locally as fallback:", {
                    messageId: message._id,
                    text: message.text?.substring(0, 30) + "..."
                });
                
                // إضافة الرسالة فوراً
                setTimeout(() => {
                    dispatch(addMessageRealTime(message));
                }, 50); // Reduced timeout for better UX
            }
            
            return result;
        } catch (error) {
            console.error('❌ useChatHook: Error sending message:', error);
            throw error;
        } finally {
            setSendingMessage(false);
        }
    }, [dispatch]);

    // Get messages for a conversation
    const loadMessages = useCallback(async (userId) => {
        try {
            setMessagesLoading(true);
            await dispatch(getMessages(userId));
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            setMessagesLoading(false);
        }
    }, [dispatch]);

    // Load users for sidebar
    const loadUsersForSidebar = useCallback(async () => {
        try {
            setSidebarLoading(true);
            await dispatch(getUsersForSidebar());
        } catch (error) {
            console.error('Error loading users for sidebar:', error);
        } finally {
            setSidebarLoading(false);
        }
    }, [dispatch]);

    // Select user for chat
    const selectUser = useCallback((user) => {
        dispatch(setSelectedUser(user));
    }, [dispatch]);

    // Handle real-time message
    const handleNewMessage = useCallback((message) => {
        console.log('📨 Received new message via Socket:', {
            messageId: message._id,
            text: message.text,
            senderId: message.senderId,
            receiverId: message.receiverId,
            timestamp: new Date().toLocaleTimeString()
        });
        dispatch(addMessageRealTime(message));
    }, [dispatch]);

    // Handle sidebar update
    const handleSidebarUpdate = useCallback(() => {
        console.log('Updating sidebar...');
        dispatch(updateSidebarRealTime());
    }, [dispatch]);

    // Auto-load sidebar on mount
    useEffect(() => {
        loadUsersForSidebar();
    }, [loadUsersForSidebar]);

    // Auto-reload sidebar when needed (debounced)
    useEffect(() => {
        if (shouldUpdateSidebar) {
            const timeoutId = setTimeout(() => {
                loadUsersForSidebar();
            }, 1000); // Wait 1 second before updating sidebar
            
            return () => clearTimeout(timeoutId);
        }
    }, [shouldUpdateSidebar, loadUsersForSidebar]);

    return {
        // State
        messages,
        usersForSidebar,
        selectedUser,
        messagesLoading,
        sidebarLoading,
        sendingMessage,
        error,
        sendMessageResult,
        
        // Actions
        sendNewMessage,
        loadMessages,
        loadUsersForSidebar,
        selectUser,
        handleNewMessage,
        handleSidebarUpdate
    };
};

export default useChatHook; 