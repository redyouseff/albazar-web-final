import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from '../components/Layout';
import { Send } from 'lucide-react';
import chatIcon from "/images/Vector (3).png"
import chatImgae from "/images/chat/Frame 264.png"
import useChatHook from '../Hook/message/useChatHook';
import { useSocket } from '../context/SocketContext.jsx';
import Spinner from '../components/ui/spinner';
import { useDarkMode } from '../context/DarkModeContext';

import chatIconDarkmode from "/images/spesificProptie/Chat icon Yellow.svg"

const Chat = () => {
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const messagesContainerRef = useRef(null);
  const sidebarRef = useRef(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const {
    messages,
    usersForSidebar,
    selectedUser,
    messagesLoading,
    sidebarLoading,
    sendingMessage,
    sendNewMessage,
    loadMessages,
    selectUser,
    handleNewMessage,
    handleSidebarUpdate
  } = useChatHook();

  const { socket, onlineUsers } = useSocket();
  const { user } = useSelector(state => state.auth);
  const { isDarkMode } = useDarkMode();
  
  // Enhanced authUser - robust user detection
  const getAuthUser = () => {
    try {
      // Primary: localStorage (your preferred method)
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
    
    // Fallback: Redux store
    const reduxUser = user?.data?.user || user?.user;
    if (reduxUser && reduxUser._id) {
      return reduxUser;
    }
    
    return null;
  };
  
  const authUser = getAuthUser();
  



  // Check if user is near bottom
  const isNearBottom = useCallback(() => {
    if (!messagesContainerRef.current) return true;
    const container = messagesContainerRef.current;
    const threshold = 100; // pixels from bottom
    return container.scrollTop + container.clientHeight >= container.scrollHeight - threshold;
  }, []);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (messagesContainerRef.current) {
      const nearBottom = isNearBottom();
      setIsUserScrolling(!nearBottom);
    }
  }, [isNearBottom]);

  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
      setIsUserScrolling(false);
    }
  }, []);

  // Auto scroll when messages change (only if user is not scrolling up)
  useEffect(() => {
    if (!isUserScrolling) {
      // Small delay to ensure message is rendered
      const timeoutId = setTimeout(() => {
        scrollToBottom();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [messages, scrollToBottom, isUserScrolling]);

  // Check if user came from PropertyDetails with user data
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('userId');
    const userName = queryParams.get('userName');
    const userImage = queryParams.get('userImage');
    
    console.log('💬 Chat: Received query parameters:', {
      userId,
      userName,
      userImage: userImage ? 'Present' : 'Not present',
      fullUrl: location.search
    });
    
    if (userId && userName) {
      console.log('💬 Chat: Starting direct conversation with user:', {
        userId,
        userName,
        hasImage: !!userImage
      });
      
      // Create a new conversation with the user from PropertyDetails
      const newUser = {
        _id: userId,
        firstname: userName.split(' ')[0] || userName,
        lastname: userName.split(' ')[1] || '',
        profileImage: userImage || chatImgae,
        lastMessage: null
      };
      
      console.log('💬 Chat: Created user object for conversation:', newUser);
      
      selectUser(newUser);
      loadMessages(userId);
      
      // Scroll to bottom when opening from property details
      setTimeout(() => {
        scrollToBottom();
      }, 500);
    } else if (userId || userName) {
      console.warn('💬 Chat: Incomplete query parameters:', { userId, userName });
    }
  }, [location.search, selectUser, loadMessages, scrollToBottom]);

  // Socket listeners - Optimized for localStorage authUser
  useEffect(() => {
    if (socket && authUser?._id) {
      // Get current auth user ID for closure stability
      const currentUserId = String(authUser._id);
      
      const onNewMessage = (message) => {
        // Use stable user ID comparison
        const isForCurrentUser = (
          String(message.senderId) === currentUserId || 
          String(message.receiverId) === currentUserId
        );
        
        if (isForCurrentUser) {
          handleNewMessage(message);
          
          // Force scroll to bottom after receiving message
          setTimeout(() => {
            scrollToBottom();
          }, 100);
        }
      };
      
      const onUpdateSidebar = () => {
        handleSidebarUpdate();
      };

      const onNewMessageNotification = (notification) => {
        // Handle notification
      };

      // Connection status listeners
      const onConnect = () => {
        // Socket connected
      };

      const onDisconnect = (reason) => {
        // Socket disconnected
      };

      const onConnectError = (error) => {
        // Socket connection error
      };

      // Register all listeners
      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      socket.on("connect_error", onConnectError);
      socket.on("newMessage", onNewMessage);
      socket.on("updateSidebar", onUpdateSidebar);
      socket.on("newMessageNotification", onNewMessageNotification);
      
      return () => {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
        socket.off("connect_error", onConnectError);
        socket.off("newMessage", onNewMessage);
        socket.off("updateSidebar", onUpdateSidebar);
        socket.off("newMessageNotification", onNewMessageNotification);
      };
    }
  }, [socket, authUser?._id, handleNewMessage, handleSidebarUpdate, scrollToBottom]);

  const handleSendMessage = useCallback(async (e) => {
    e.preventDefault();
    if (message.trim() && selectedUser && !sendingMessage && authUser?._id) {
      const messageText = message.trim();
      setMessage(''); // Clear input immediately for better UX
      
      try {
        const result = await sendNewMessage(selectedUser._id, { text: messageText });
        
        // Force scroll to bottom after sending message
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      } catch (error) {
        // Restore message if sending failed
        setMessage(messageText);
      }
    }
  }, [message, selectedUser, sendNewMessage, sendingMessage, authUser?._id, scrollToBottom]);

  // Handle contact selection
  const handleContactSelect = useCallback((contact) => {
    if (selectedUser?._id !== contact._id) {
      selectUser(contact);
      loadMessages(contact._id);
      
      // Scroll to bottom when switching conversations
      setTimeout(() => {
        scrollToBottom();
      }, 300);
    }
  }, [selectUser, loadMessages, selectedUser, scrollToBottom]);

  // Check if user is online
  const isUserOnline = useCallback((userId) => {
    return onlineUsers.includes(userId);
  }, [onlineUsers]);

  // Format message time
  const formatMessageTime = useCallback((timestamp) => {
    return new Date(timestamp).toLocaleTimeString('ar', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }, []);

  // Get display name
  const getDisplayName = useCallback((user) => {
    return user.firstname && user.lastname 
      ? `${user.firstname} ${user.lastname}` 
      : user.firstname || user.name || 'مستخدم';
  }, []);

  // Handle mobile sidebar toggle
  const toggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(prev => !prev);
  }, []);

  // Close mobile sidebar when selecting a contact
  const handleMobileContactSelect = useCallback((contact) => {
    handleContactSelect(contact);
    setIsMobileSidebarOpen(false);
  }, [handleContactSelect]);

  return (
    <Layout>
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-[#F8FAFC]'}`}>
        {/* Chat Container with Header */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with shadow */}
          <div className={`${isDarkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b border-[#0000000A]'} rounded-t-lg relative`}>
            <div className="flex justify-center items-center py-4">
              <div className="flex items-center gap-2">
                <h1 className={`text-2xl font-bold ml-2 ${isDarkMode ? 'text-purple-200' : ''}`}>المحادثة</h1>
                <img src={isDarkMode?   chatIconDarkmode : chatIcon} alt="chat icon" className="w-6 h-6" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 shadow-[0_1px_3px_rgba(0,0,0,0.05)]"></div>
          </div>

          {/* Chat Box */}
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-b-lg shadow-[0_0_0_1px_rgba(0,0,0,0.05)] overflow-hidden`}>
            <div className="flex h-[calc(100vh-160px)]" style={{ maxHeight: 'calc(100vh - 160px)' }}>
              {/* Mobile Sidebar Overlay */}
              {isMobileSidebarOpen && (
                <div 
                  className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                  onClick={() => setIsMobileSidebarOpen(false)}
                />
              )}

              {/* Chat List - Mobile Sidebar */}
              <div className={`lg:hidden fixed top-0 left-0 h-full w-80 z-50 transform transition-transform duration-300 ease-in-out ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isDarkMode ? 'bg-gray-900 border-r border-gray-700' : 'bg-white border-r border-[#0000000A]'}`}>
                <div className={`py-3 px-4 relative flex-shrink-0 ${isDarkMode ? 'border-b border-gray-700' : 'border-b border-[#0000000A]'}`}>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className={`p-2 rounded-lg ${isDarkMode ? 'text-purple-200 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <h3 className={`font-bold text-[15px] text-right ${isDarkMode ? 'text-purple-200' : ''}`}>صندوق المحادثة</h3>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 shadow-[0_1px_3px_rgba(0,0,0,0.05)]"></div>
                </div>
                
                <div ref={sidebarRef} className={`overflow-y-auto flex-1 min-h-0 ${isDarkMode ? 'scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900' : ''}`}>
                  {sidebarLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <Spinner size="medium" />
                    </div>
                  ) : (
                    <div className={`${isDarkMode ? 'divide-y divide-gray-800' : 'divide-y divide-[#0000000A]'}`}>
                      {usersForSidebar.length === 0 ? (
                        <div className={`p-4 text-center ${isDarkMode ? 'text-purple-300' : 'text-gray-500'}`}>
                          لا توجد محادثات حتى الآن
                        </div>
                      ) : (
                        usersForSidebar.map((contact) => (
                          <div 
                            key={contact._id} 
                            onClick={() => handleMobileContactSelect(contact)}
                            className={`flex items-center px-4 py-2.5 cursor-pointer transition ${selectedUser?._id === contact._id ? (isDarkMode ? 'bg-yellow-900' : 'bg-[#FFF9DB]') : (isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-[#FFF9DB]')}`}
                          >
                            <div className="relative ml-3">
                              <img
                                src={contact.profileImage || chatImgae}
                                alt={getDisplayName(contact)}
                                className="w-11 h-11 rounded-full object-cover"
                                onError={(e) => {
                                  e.target.src = chatImgae;
                                }}
                              />
                              {isUserOnline(contact._id) && (
                                <div className="absolute -bottom-0.5 -left-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-[1.5px] border-white"></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`font-bold text-[15px] text-right mb-0.5 ${isDarkMode ? 'text-yellow-400' : 'text-gray-900'}`}>
                                {getDisplayName(contact)}
                              </p>
                              <p className={`text-[13px] truncate text-right leading-tight ${isDarkMode ? 'text-purple-300' : 'text-gray-400'}`}>
                                {contact.lastMessage?.text || 'ابدأ محادثة جديدة...'}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Chat List - Desktop Sidebar */}
              <div className={`hidden lg:flex lg:w-[380px] flex-col max-h-full ${isDarkMode ? 'border-l border-gray-700 bg-gray-900' : 'border-l border-[#0000000A]'}`}>
                <div className={`py-3 px-4 relative flex-shrink-0 ${isDarkMode ? 'border-b border-gray-700' : 'border-b border-[#0000000A]'}`}>
                  <h3 className={`font-bold text-[15px] text-right ${isDarkMode ? 'text-purple-200' : ''}`}>صندوق المحادثة</h3>
                  <div className="absolute bottom-0 left-0 right-0 h-1 shadow-[0_1px_3px_rgba(0,0,0,0.05)]"></div>
                </div>
                
                <div ref={sidebarRef} className={`overflow-y-auto flex-1 min-h-0 ${isDarkMode ? 'scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900' : ''}`}>
                  {sidebarLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <Spinner size="medium" />
                    </div>
                  ) : (
                  <div className={`${isDarkMode ? 'divide-y divide-gray-800' : 'divide-y divide-[#0000000A]'}`}>
                      {usersForSidebar.length === 0 ? (
                        <div className={`p-4 text-center ${isDarkMode ? 'text-purple-300' : 'text-gray-500'}`}>
                          لا توجد محادثات حتى الآن
                        </div>
                      ) : (
                        usersForSidebar.map((contact) => (
                          <div 
                            key={contact._id} 
                            onClick={() => handleContactSelect(contact)}
                            className={`flex items-center px-4 py-2.5 cursor-pointer transition ${selectedUser?._id === contact._id ? (isDarkMode ? 'bg-yellow-900' : 'bg-[#FFF9DB]') : (isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-[#FFF9DB]')}`}
                          >
                        <div className="relative ml-3">
                          <img
                                src={contact.profileImage || chatImgae}
                                alt={getDisplayName(contact)}
                                className="w-11 h-11 rounded-full object-cover"
                                onError={(e) => {
                                  e.target.src = chatImgae;
                                }}
                          />
                              {isUserOnline(contact._id) && (
                            <div className="absolute -bottom-0.5 -left-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-[1.5px] border-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                              <p className={`font-bold text-[15px] text-right mb-0.5 ${isDarkMode ? 'text-yellow-400' : 'text-gray-900'}`}>
                                {getDisplayName(contact)}
                              </p>
                              <p className={`text-[13px] truncate text-right leading-tight ${isDarkMode ? 'text-purple-300' : 'text-gray-400'}`}>
                                {contact.lastMessage?.text || 'ابدأ محادثة جديدة...'}
                              </p>
                        </div>
                      </div>
                        ))
                      )}
                  </div>
                  )}
                </div>
              </div>

              {/* Chat Area - Full width on mobile, flex-1 on desktop */}
              <div className={`flex-1 flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-[#F8FAFC]'}`}>
                {selectedUser ? (
                  <>
                    {/* Chat Header */}
                    <div className={`${isDarkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b border-[#0000000A]'} px-4 sm:px-6 py-3 flex items-center gap-3`}>
                      {/* Mobile Menu Button */}
                      <button
                        onClick={toggleMobileSidebar}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      </button>
                      
                      <img
                        src={selectedUser.profileImage || chatImgae}
                        alt={getDisplayName(selectedUser)}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = chatImgae;
                        }}
                      />
                      <div className="flex-1">
                        <h3 className={`font-bold text-[15px] ${isDarkMode ? 'text-yellow-400' : ''}`}>{getDisplayName(selectedUser)}</h3>
                        <p className={`text-[12px] ${isDarkMode ? 'text-purple-300' : 'text-gray-500'}`}>
                          {isUserOnline(selectedUser._id) ? 'متصل الآن' : 'غير متصل'}
                        </p>
                      </div>
                    </div>

                {/* Messages */}
                    <div 
                      ref={messagesContainerRef} 
                      className={`flex-1 overflow-y-auto p-4 sm:p-6 ${isDarkMode ? 'bg-gray-900' : ''} ${isDarkMode ? 'scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900' : ''}`}
                      onScroll={handleScroll}
                    >
                      {messagesLoading ? (
                        <div className="flex justify-center items-center h-full">
                          <Spinner size="medium" />
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {messages.length === 0 ? (
                            <div className={`text-center py-10 ${isDarkMode ? 'text-purple-300' : 'text-gray-500'}`}>لا توجد رسائل. ابدأ المحادثة!</div>
                          ) : (
                            <>
                              {messages.map((msg, index) => {
                                const isMyMessage = String(msg.senderId) === String(authUser?._id);
                                return (
                      <div
                                    key={msg._id}
                                    className={`flex ${isMyMessage ? 'justify-start' : 'justify-end'} ${index > 0 ? 'mt-3' : ''}`}
                      >
                        {/* Message bubble */}
                        <div
                          className={`max-w-[85%] sm:max-w-[70%] px-4 py-3 rounded-2xl border ${
                            isMyMessage
                              ? isDarkMode
                                ? 'bg-yellow-400 text-gray-900 border-yellow-400'
                                : 'bg-[#FFE600] text-gray-900 border-[#E6CF00]'
                              : isDarkMode
                                ? 'bg-gray-800 text-purple-200 border-gray-700'
                                : 'bg-white text-gray-900 border-[#0000000A] shadow-[0_1px_2px_rgba(0,0,0,0.05)]'
                          }`}
                        >
                          <p className="text-[14px] leading-[1.6] font-[450] text-right break-words">
                            {msg.text}
                          </p>
                          <p className={`text-[11px] mt-1.5 text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>{formatMessageTime(msg.createdAt)}</p>
                        </div>
                      </div>
                                );
                              })}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className={`text-center ${isDarkMode ? 'text-purple-300' : 'text-gray-500'}`}>
                      {/* Mobile Menu Button for Empty State */}
                      <button
                        onClick={toggleMobileSidebar}
                        className="lg:hidden mb-4 p-3 rounded-lg bg-yellow-400 text-gray-900 hover:bg-yellow-300 transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      </button>
                      <img src={isDarkMode?   chatIconDarkmode : chatIcon} alt="chat" className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">اختر محادثة لبدء الدردشة</p>
                      <p className="text-sm mt-2 lg:hidden">اضغط على الزر أعلاه لرؤية المحادثات</p>
                    </div>
                  </div>
                )}

                {/* Message Input */}
                {selectedUser && (
                <form onSubmit={handleSendMessage} className={`${isDarkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-white border-t border-[#0000000A]'} p-4`}>
                  <div className="flex space-x-reverse space-x-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="اكتب رسالتك هنا..."
                      className={`flex-1 px-4 py-2.5 rounded-lg focus:ring-1 focus:ring-yellow-400 focus:border-transparent text-[14px] ${isDarkMode ? 'bg-gray-900 text-purple-200 border border-gray-700 placeholder-purple-300' : 'bg-[#F8FAFC] border border-[#0000000A]'}`}
                      dir="rtl"
                        disabled={sendingMessage}
                    />
                    <button
                      type="submit"
                        disabled={sendingMessage || !message.trim()}
                        className={`px-3.5 py-2.5 rounded-lg transition-colors border disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode ? 'bg-yellow-400 text-gray-900 border-yellow-400 hover:bg-yellow-300' : 'bg-[#FFE600] text-black border-[#E6CF00] hover:bg-[#FFE600]/90'}`}
                    >
                        {sendingMessage ? (
                          <div className="w-[18px] h-[18px] animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                        ) : (
                      <Send className="h-[18px] w-[18px]" />
                        )}
                    </button>
                  </div>
                </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
