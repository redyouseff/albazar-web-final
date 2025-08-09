import { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    
    const { user } = useSelector(state => state.auth);
    
    // Enhanced authUser - support localStorage and Redux
    const getAuthUser = () => {
        try {
            // Primary: localStorage
            const localUser = localStorage.getItem("user");
            if (localUser) {
                const parsedUser = JSON.parse(localUser);
                if (parsedUser && parsedUser._id) {
                    return parsedUser;
                }
            }
        } catch (error) {
            // Error parsing user from localStorage
        }
        
        // Fallback: Redux
        const reduxUser = user?.data?.user || user?.user;
        if (reduxUser && reduxUser._id) {
            return reduxUser;
        }
        
        return null;
    };
    
    const authUser = getAuthUser();

    useEffect(() => {
        if (authUser && authUser._id) {
            // Use localhost for development (update for production)
            const socketUrl = "http://localhost:8000";
            
            const newSocket = io(socketUrl, {
                query: {
                    userId: String(authUser._id), // Ensure string conversion
                },
                transports: ['websocket', 'polling'],
                autoConnect: true,
                forceNew: false,
                timeout: 20000
            });

            setSocket(newSocket);

            // Enhanced connection listeners
            newSocket.on("connect", () => {
                // Socket connected successfully
            });

            newSocket.on("connect_error", (error) => {
                // Connection error occurred
            });

            newSocket.on("disconnect", (reason) => {
                // Socket disconnected
            });

            // Listen for online users
            newSocket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            // Listen for reconnection
            newSocket.on("reconnect", (attemptNumber) => {
                // Reconnected after attempts
            });

            newSocket.on("reconnect_attempt", (attemptNumber) => {
                // Attempting to reconnect
            });

            return () => {
                newSocket.close();
            };
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [authUser?._id]); // Use authUser._id instead of full authUser object for stability

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
}; 