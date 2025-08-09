import { useEffect } from 'react';
import { useSocket } from '../../context/SocketContext.jsx';
import useChatHook from './useChatHook';
import { useSelector } from 'react-redux';

export const useSocketHook = () => {
    const { socket } = useSocket();
    const { handleNewMessage, handleSidebarUpdate } = useChatHook();
    const { user } = useSelector(state => state.auth);
    const authUser = user?.data?.user || user?.user;

    useEffect(() => {
        if (socket && authUser) {
            // Listen for new messages
            socket.on("newMessage", (message) => {
                console.log("New message received:", message);
                handleNewMessage(message);
            });

            // Listen for sidebar updates
            socket.on("updateSidebar", () => {
                console.log("Sidebar update received");
                handleSidebarUpdate();
            });

            // Listen for new message notifications
            socket.on("newMessageNotification", (notification) => {
                console.log("New message notification:", notification);
                // You can add notification logic here
                // For example, show a toast notification
            });

            return () => {
                socket.off("newMessage");
                socket.off("updateSidebar");
                socket.off("newMessageNotification");
            };
        }
    }, [socket, authUser, handleNewMessage, handleSidebarUpdate]);

    return { socket };
};

export default useSocketHook; 