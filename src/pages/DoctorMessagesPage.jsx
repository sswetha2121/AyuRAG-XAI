import React, { useState, useEffect, useRef } from 'react';
import './DoctorMessagesPage.css';
import { api } from '../services/api';
import {
  MessageSquare,
  Send,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  ShieldCheck,
  RefreshCw,
  Info
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const DoctorMessagesPage = ({ onTriggerToast }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  const fetchConversations = async (silent = false) => {
    try {
      if (!silent) setIsLoadingConversations(true);
      const res = await api.getConversations();
      const list = res.conversations || [];
      setConversations(list);

      // Default to first conversation if none selected
      if (!selectedUser && list.length > 0) {
        setSelectedUser(list[0]);
      }
    } catch (err) {
      if (!silent) {
        onTriggerToast?.({
          type: 'error',
          title: 'Conversations Failed',
          message: err.message || 'Could not fetch message conversations.',
        });
      }
    } finally {
      if (!silent) setIsLoadingConversations(false);
    }
  };

  const fetchMessages = async (userId, silent = false) => {
    if (!userId) return;
    try {
      if (!silent) setIsLoadingMessages(true);
      const res = await api.getConversationMessages(userId);
      setMessages(res.messages || []);
    } catch (err) {
      if (!silent) {
        onTriggerToast?.({
          type: 'error',
          title: 'Messages Load Failed',
          message: err.message || 'Could not load conversation history.',
        });
      }
    } finally {
      if (!silent) setIsLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedUser?.user_id) {
      fetchMessages(selectedUser.user_id);
    }
  }, [selectedUser?.user_id]);

  // Polling for new incoming messages every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchConversations(true);
      if (selectedUser?.user_id) {
        fetchMessages(selectedUser.user_id, true);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [selectedUser?.user_id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const text = messageText.trim();
    if (!text || !selectedUser?.user_id) return;

    try {
      setIsSending(true);
      const res = await api.sendMessage(selectedUser.user_id, text);
      setMessageText('');
      // Append confirmed message
      if (res.message) {
        setMessages((prev) => [...prev, res.message]);
      }
      fetchConversations(true);
      onTriggerToast?.({
        type: 'success',
        title: 'Message Sent',
        message: 'Your message has been securely delivered to the patient.',
      });
    } catch (err) {
      onTriggerToast?.({
        type: 'error',
        title: 'Send Failed',
        message: err.message || 'Could not send message.',
      });
    } finally {
      setIsSending(false);
    }
  };

  const filteredConversations = conversations.filter((c) =>
    (c.user_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="ayur-messages-page">
      {/* 1. Header Banner with Regulatory Non-Emergency Notice */}
      <div className="ayur-msg-top-banner">
        <div className="flex items-center justify-between flex-wrap gap-md">
          <div>
            <div className="flex items-center gap-xs mb-xs">
              <span className="ayur-msg-badge">CLINICAL TELE-CONSULTATION</span>
              <span className="ayur-msg-badge ayur-msg-badge--secure">SECURE END-TO-END</span>
            </div>
            <h1 className="ayur-msg-title">Patient–Doctor Clinical Consultation</h1>
            <p className="ayur-msg-subtitle">
              Persistent, direct messaging with your assigned patients for diet guidance, symptom clarifications, and follow-ups.
            </p>
          </div>

          <button
            type="button"
            className="ayur-msg-sync-btn"
            onClick={() => {
              fetchConversations();
              if (selectedUser?.user_id) fetchMessages(selectedUser.user_id);
            }}
          >
            <RefreshCw size={14} />
            <span>Sync Messages</span>
          </button>
        </div>

        {/* Emergency Medical Disclaimer */}
        <div className="ayur-msg-emergency-notice">
          <AlertCircle size={17} className="text-accent flex-shrink-0" />
          <span>
            <strong>Medical Notice:</strong> This clinical messaging channel is for non-urgent dietary
            consultation and habit support. If experiencing acute physical distress, severe chest discomfort,
            or urgent complications, immediately call emergency services or visit the nearest hospital.
          </span>
        </div>
      </div>

      {/* 2. Chat Layout */}
      <div className="ayur-chat-layout">
        {/* Left: Conversations List */}
        <div className="ayur-chat-sidebar">
          <div className="ayur-conv-search-wrap">
            <Search size={14} className="ayur-conv-search-icon" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ayur-conv-search-input"
            />
          </div>

          <div className="ayur-conv-list">
            {isLoadingConversations ? (
              <div className="p-md text-center text-xs text-muted">Loading active conversations...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-md text-center text-xs text-muted">No conversations found.</div>
            ) : (
              filteredConversations.map((c) => {
                const isSelected = selectedUser?.user_id === c.user_id;
                const unread = c.unread_count || 0;

                return (
                  <button
                    key={c.user_id}
                    type="button"
                    className={`ayur-conv-item ${isSelected ? 'ayur-conv-item--active' : ''}`}
                    onClick={() => setSelectedUser(c)}
                  >
                    <div className="ayur-conv-avatar">
                      {(c.user_name || 'PT')
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>

                    <div className="ayur-conv-info">
                      <div className="flex items-center justify-between mb-xs">
                        <span className="ayur-conv-name">{c.user_name}</span>
                        {c.last_message_at && (
                          <span className="ayur-conv-time">
                            {new Date(c.last_message_at).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="ayur-conv-snippet">
                          {c.last_message || 'Start conversation...'}
                        </span>
                        {unread > 0 && (
                          <span className="ayur-conv-unread-chip">{unread}</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Active Message Thread */}
        <div className="ayur-chat-main">
          {selectedUser ? (
            <>
              {/* Chat Thread Header */}
              <div className="ayur-thread-header">
                <div className="flex items-center gap-sm">
                  <div className="ayur-thread-avatar">
                    {(selectedUser.user_name || 'PT')
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div>
                    <h3 className="ayur-thread-title">{selectedUser.user_name}</h3>
                    <span className="ayur-thread-sub">
                      Assigned Patient • {selectedUser.prakriti || 'Ayurvedic Clinical Care'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-xs">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => (window.location.href = `/doctor/patients/${selectedUser.user_id}`)}
                  >
                    View Chart
                  </Button>
                  <Button
                    variant="primary"
                    size="xs"
                    onClick={() => (window.location.href = '/doctor/diet-plans')}
                  >
                    Diet Plan
                  </Button>
                </div>
              </div>

              {/* Message History Feed */}
              <div className="ayur-messages-feed">
                {isLoadingMessages ? (
                  <div className="p-xl text-center text-xs text-muted">Loading message history...</div>
                ) : messages.length === 0 ? (
                  <div className="ayur-messages-empty">
                    <MessageSquare size={32} className="text-muted mb-xs" />
                    <p className="font-medium text-sm text-text-primary">No messages exchanged yet</p>
                    <p className="text-xs text-muted">
                      Send a message below to initiate clinical guidance with {selectedUser.user_name}.
                    </p>
                  </div>
                ) : (
                  messages.map((m) => {
                    const isDoctor = m.sender_role === 'DOCTOR';
                    const timeStr = m.created_at
                      ? new Date(m.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '';

                    return (
                      <div
                        key={m.id}
                        className={`ayur-msg-bubble-wrap ${isDoctor ? 'ayur-msg-bubble-wrap--doctor' : 'ayur-msg-bubble-wrap--patient'}`}
                      >
                        <div className="ayur-msg-bubble">
                          <div className="ayur-msg-sender-bar">
                            <span className="ayur-msg-sender-name">
                              {isDoctor ? 'You (Attending Physician)' : selectedUser.user_name}
                            </span>
                            <span className="ayur-msg-timestamp">{timeStr}</span>
                          </div>

                          <div className="ayur-msg-body">{m.body}</div>

                          {isDoctor && (
                            <div className="ayur-msg-status">
                              {m.is_read ? '✓✓ Read' : '✓ Delivered'}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Form */}
              <form className="ayur-msg-input-form" onSubmit={handleSendMessage}>
                <textarea
                  rows={2}
                  className="ayur-msg-textarea"
                  placeholder={`Type a clinical response or dietary guidance for ${selectedUser.user_name}...`}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  disabled={isSending || !messageText.trim()}
                  leftIcon={<Send size={15} />}
                >
                  {isSending ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </>
          ) : (
            <div className="p-xl text-center text-muted">
              Select a patient conversation on the left to start messaging.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
