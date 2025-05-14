import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ChatHistory.css';

const ChatHistory = () => {
  const [groupedChats, setGroupedChats] = useState({});
  const [filteredChats, setFilteredChats] = useState({});
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' for newest first, 'asc' for oldest first
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/get_user_chat_history', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.status === 'success') {
          const fetchedChatHistory = response.data.data.chat_history || [];

          const grouped = fetchedChatHistory.reduce((acc, chat) => {
            const sessionId = chat.session_id;
            if (!acc[sessionId]) {
              acc[sessionId] = {
                session_start_time: chat.session_start_time,
                messages: []
              };
            }
            acc[sessionId].messages.push({
              chat_id: chat.chat_id,
              message: chat.message,
              response: chat.response,
              timestamp: chat.timestamp
            });
            return acc;
          }, {});
          setGroupedChats(grouped);
          setFilteredChats(grouped);

          const sessionIds = Object.keys(grouped);
          if (sessionIds.length > 0) {
            setSelectedSession(sessionIds[0]);
          }
        } else {
          setError('Failed to load chat history: ' + response.data.message);
        }
        setLoading(false);
      } catch (error) {
        setError('Error fetching chat history: ' + (error.response?.data?.message || error.message));
        setLoading(false);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchChatHistory();
  }, [navigate]);

  // Handle Search
  useEffect(() => {
    if (!searchQuery) {
      setFilteredChats(groupedChats);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();
    const filtered = Object.entries(groupedChats).reduce((acc, [sessionId, sessionData]) => {
      const hasMatch = sessionData.messages.some(
        (msg) =>
          msg.message.toLowerCase().includes(lowerQuery) ||
          msg.response.toLowerCase().includes(lowerQuery)
      );
      if (hasMatch) {
        acc[sessionId] = sessionData;
      }
      return acc;
    }, {});
    setFilteredChats(filtered);

    const filteredSessionIds = Object.keys(filtered);
    if (filteredSessionIds.length > 0 && !filteredSessionIds.includes(selectedSession)) {
      setSelectedSession(filteredSessionIds[0]);
    } else if (filteredSessionIds.length === 0) {
      setSelectedSession(null);
    }
  }, [searchQuery, groupedChats, selectedSession]);

  const handleGoToChat = () => {
    navigate('/chat');
  };

  const handleSessionClick = (sessionId) => {
    setSelectedSession(sessionId);
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/delete_session/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const updatedChats = { ...groupedChats };
      delete updatedChats[sessionId];
      setGroupedChats(updatedChats);
      setFilteredChats(updatedChats);

      const sessionIds = Object.keys(updatedChats);
      if (sessionIds.length > 0) {
        setSelectedSession(sessionIds[0]);
      } else {
        setSelectedSession(null);
      }
    } catch (error) {
      setError('Error deleting session: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSortToggle = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch((err) => {
      console.error('Failed to copy: ', err);
    });
  };

  if (loading) return <div className="text-white text-center">Loading chat history...</div>;

  if (error) return <div className="text-red-500 text-center">{error}</div>;

  // Sort sessions based on start time
  const sortedSessions = Object.entries(filteredChats).sort((a, b) => {
    const dateA = new Date(a[1].session_start_time);
    const dateB = new Date(b[1].session_start_time);
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="chat-history">
      <div className="header">
        <h2>Chat History</h2>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
            aria-label="Search chat history"
          />
          <button
            onClick={handleSortToggle}
            className="sort-btn"
            aria-label={`Sort sessions by date ${sortOrder === 'desc' ? 'oldest first' : 'newest first'}`}
          >
            Sort: {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
          </button>
          <button
            onClick={handleGoToChat}
            className="go-to-chat-btn"
            aria-label="Go to chat page"
          >
            <span>Start a New Chat</span>
            <svg className="chat-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
        </div>
      </div>
      {Object.keys(filteredChats).length === 0 ? (
        searchQuery ? (
          <div className="empty-state">
            <svg className="empty-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>No chats match your search.</p>
            <button
              onClick={handleGoToChat}
              className="empty-state-btn"
              aria-label="Start a new chat"
            >
              Start a New Chat
            </button>
          </div>
        ) : (
          <div className="empty-state">
            <svg className="empty-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>No chat history yet.</p>
            <button
              onClick={handleGoToChat}
              className="empty-state-btn"
              aria-label="Start a new chat"
            >
              Start a New Chat
            </button>
          </div>
        )
      ) : (
        <div className="chat-history-container">
          {/* Left Panel: Sessions List */}
          <div className="sessions-panel">
            <h3 className="panel-title">Sessions</h3>
            <div className="sessions-scroll">
              {sortedSessions.map(([sessionId, sessionData]) => (
                <div
                  key={sessionId}
                  className={`session-item ${selectedSession === sessionId ? 'selected' : ''}`}
                  onClick={() => handleSessionClick(sessionId)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSessionClick(sessionId)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Select session ${sessionId}`}
                >
                  <div className="session-info">
                    <div className="session-header">
                      <span className="session-id">Session {sessionId}</span>
                      <span className="message-count">{sessionData.messages.length} messages</span>
                    </div>
                    <div className="session-date">
                      <svg className="date-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{new Date(sessionData.session_start_time).toLocaleString()}</span>
                    </div>
                    <div className="session-preview">
                      <p>
                        {sessionData.messages[sessionData.messages.length - 1]?.message?.substring(0, 50) || 'No messages'}...
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSession(sessionId);
                      }}
                      className="delete-session-btn"
                      aria-label={`Delete session ${sessionId}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="delete-icon">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Messages for Selected Session */}
          <div className="messages-panel">
            {selectedSession ? (
              <>
                <h3 className="panel-title">
                  Messages for Session {selectedSession} ({groupedChats[selectedSession].messages.length} messages)
                </h3>
                <div className="messages-scroll">
                  {groupedChats[selectedSession].messages.map((msg) => (
                    <div key={msg.chat_id} className="message-item">
                      <div className="message-header">
                        <span className="message-time">
                          {new Date(msg.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="message-content">
                        <div className="message-row">
                          <p><strong>You:</strong> {msg.message}</p>
                          <button
                            onClick={() => handleCopyToClipboard(msg.message)}
                            className="copy-btn"
                            aria-label="Copy your message"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="copy-icon">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                        <div className="message-row">
                          <p><strong>MindEase:</strong> {msg.response}</p>
                          <button
                            onClick={() => handleCopyToClipboard(msg.response)}
                            className="copy-btn"
                            aria-label="Copy MindEase response"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="copy-icon">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="no-selection">Select a session to view messages.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHistory;