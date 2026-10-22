import React, { useState, useEffect, useRef } from 'react';
import './PatientChatView.css';
import { api } from '../../services/api';
import {
  MessageSquare,
  Send,
  Stethoscope,
  ShieldAlert,
  Clock,
  CheckCircle2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/Button';

export const PatientChatView = ({ onTriggerToast }) => {
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchDoctorAndMessages = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      const convRes = await api.getConversations();
      const convList = convRes.conversations || [];

      if (convList.length > 0) {
        const primaryDoc = convList[0];
        setDoctorInfo(primaryDoc);

        const msgRes = await api.getConversationMessages(primaryDoc.user_id);
        setMessages(msgRes.messages || []);
      } else {
        // Fallback: fetch auth/me to find assigned doctor
        const me = await api.getAuthMe();
        if (me?.assigned_doctor) {
          setDoctorInfo({
            user_id: me.assigned_doctor.id,
            user_name: me.assigned_doctor.name || `Dr. ${me.assigned_doctor.username}`,
            qualification: 'BAMS, MD (Ayurveda)',
          });
          const msgRes = await api.getConversationMessages(me.assigned_doctor.id);
          setMessages(msgRes.messages || []);
        }
      }
    } catch (err) {
      if (!silent) {
        console.log('Error loading patient chat:', err);
      }
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorAndMessages();
  }, []);

  // Poll for doctor replies every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDoctorAndMessages(true);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const text = messageText.trim();
    if (!text || !doctorInfo?.user_id) return;

    try {
      setIsSending(true);
      const res = await api.sendMessage(doctorInfo.user_id, text);
      setMessageText('');
      if (res.message) {
        setMessages((prev) => [...prev, res.message]);
      }
      onTriggerToast?.({
        type: 'success',
        title: 'Message Sent',
        message: 'Your message has been delivered to your attending physician.',
      });
    } catch (err) {
      onTriggerToast?.({
        type: 'error',
        title: 'Failed to Send',
        message: err.message || 'Could not deliver message to doctor.',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="ayur-patient-chat-card">
      {/* 1. Physician Header Card */}
      <div className="ayur-pchat-header">
        <div className="flex items-center gap-sm">
          <div className="ayur-pchat-avatar">
            <Stethoscope size={20} />
          </div>
          <div>
            <div className="flex items-center gap-xs">
              <h3 className="ayur-pchat-name">
                {doctorInfo?.user_name || 'Dr. Sharma (Attending Physician)'}
              </h3>
              <span className="ayur-pchat-status-pill">● Online for Consultation</span>
            </div>
            <p className="ayur-pchat-meta">
              Ayurvedic Clinical Lead • Kayachikitsa & Dietetics
            </p>
          </div>
        </div>

        <button
          type="button"
          className="ayur-pchat-sync-btn"
          onClick={() => fetchDoctorAndMessages()}
          title="Sync messages"
        >
          <RefreshCw size={14} />
          <span>Sync</span>
        </button>
      </div>

      {/* 2. Medical Non-Emergency Disclaimer */}
      <div className="ayur-pchat-emergency-banner">
        <ShieldAlert size={16} className="text-accent flex-shrink-0" />
        <span>
          <strong>Notice:</strong> This consultation chat is for dietary questions and habit guidance.
          It is not monitored 24/7 for acute medical emergencies. If experiencing severe distress,
          please visit an emergency medical center immediately.
        </span>
      </div>

      {/* 3. Messages Stream */}
      <div className="ayur-pchat-stream">
        {isLoading ? (
          <div className="p-xl text-center text-xs text-muted">
            <div className="ayur-spinner-mini mx-auto mb-xs" />
            <span>Connecting with physician message records...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="ayur-pchat-empty">
            <MessageSquare size={36} className="text-secondary mb-xs opacity-60" />
            <h4 className="font-semibold text-sm text-text-primary">
              Ask Your Doctor a Dietary Question
            </h4>
            <p className="text-xs text-muted max-w-sm">
              Inquire about your active diet plan, ingredient substitutes, digestion symptoms, or meal schedule.
            </p>
          </div>
        ) : (
          messages.map((m) => {
            const isPatient = m.sender_role === 'PATIENT';
            const timeStr = m.created_at
              ? new Date(m.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '';

            return (
              <div
                key={m.id}
                className={`ayur-pmsg-row ${isPatient ? 'ayur-pmsg-row--patient' : 'ayur-pmsg-row--doctor'}`}
              >
                <div className="ayur-pmsg-bubble">
                  <div className="ayur-pmsg-meta-bar">
                    <span className="ayur-pmsg-sender">
                      {isPatient ? 'You' : doctorInfo?.user_name || 'Dr. Sharma'}
                    </span>
                    <span className="ayur-pmsg-time">{timeStr}</span>
                  </div>
                  <div className="ayur-pmsg-text">{m.body}</div>
                  {isPatient && (
                    <div className="ayur-pmsg-status">
                      {m.is_read ? '✓✓ Read by Doctor' : '✓ Delivered'}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 4. Message Input Bar */}
      <form onSubmit={handleSendMessage} className="ayur-pchat-input-bar">
        <textarea
          rows={2}
          placeholder="Ask a question about your diet plan, report a digestion concern, or request guidance..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(e);
            }
          }}
          className="ayur-pchat-textarea"
        />
        <Button
          variant="primary"
          size="md"
          type="submit"
          disabled={isSending || !messageText.trim()}
          leftIcon={<Send size={15} />}
        >
          {isSending ? 'Sending...' : 'Send'}
        </Button>
      </form>
    </div>
  );
};
