// MessagingModal.jsx - Create this as a new component
import React, { useState } from "react";
import Swal from "sweetalert2";
import useAxios from "../../Auth/useAxios";
import { PaperAirplaneIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

const MessagingModal = ({ lead, onClose, onSuccess }) => {
  const api = useAxios();
  const [loading, setLoading] = useState(false);
  const [messageType, setMessageType] = useState("sms");
  const [message, setMessage] = useState("");
  
  // Template messages
  const templateMessages = [
    
    { label: "Thank You", text: `Thank you for your time ${lead.customerName}. We appreciate your interest in our services.` }
  ];

  const handleTemplateSelect = (template) => {
    setMessage(template.text);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      Swal.fire("Error", "Please enter a message", "error");
      return;
    }

    const payload = {
      leadId: lead.id,
      to: lead.mobile,
      message: message
    };

    try {
      setLoading(true);
      
      const endpoint = messageType === "sms" 
        ? "/api/messages/sms" 
        : "/api/messages/whatsapp";
      
      const response = await api.post(endpoint, payload);
      
      // Show success message with message SID
      Swal.fire({
        title: "Success!",
        text: `${messageType.toUpperCase()} sent successfully! Message SID: ${response.data}`,
        icon: "success",
        timer: 3000
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error sending message:", error);
      Swal.fire("Error", `Failed to send ${messageType}. Please try again.`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${messageType === 'sms' ? 'bg-blue-100' : 'bg-green-100'}`}>
              {messageType === 'sms' ? (
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-600" />
              ) : (
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-green-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Send {messageType.toUpperCase()}
              </h2>
              <p className="text-sm text-gray-600">
                To: {lead.customerName} ({lead.mobile})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Message Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Message Type
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setMessageType("sms")}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${messageType === "sms" 
                  ? "border-blue-500 bg-blue-50 text-blue-700" 
                  : "border-gray-300 hover:border-gray-400"}`}
              >
                <div className="flex flex-col items-center">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 mb-1" />
                  <span className="font-medium">SMS</span>
                  <span className="text-xs text-gray-500 mt-1">Standard text message</span>
                </div>
              </button>
              
              <button
                onClick={() => setMessageType("whatsapp")}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${messageType === "whatsapp" 
                  ? "border-green-500 bg-green-50 text-green-700" 
                  : "border-gray-300 hover:border-gray-400"}`}
              >
                <div className="flex flex-col items-center">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 mb-1" />
                  <span className="font-medium">WhatsApp</span>
                  <span className="text-xs text-gray-500 mt-1">WhatsApp Business</span>
                </div>
              </button>
            </div>
          </div>

          {/* Template Messages */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Templates
            </label>
            <div className="grid grid-cols-2 gap-2">
              {templateMessages.map((template, index) => (
                <button
                  key={index}
                  onClick={() => handleTemplateSelect(template)}
                  className="text-left p-3 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
                >
                  <div className="text-sm font-medium text-gray-800">
                    {template.label}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {template.text.substring(0, 40)}...
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Message *
            </label>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="5"
              placeholder={`Type your ${messageType} message here...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={messageType === "sms" ? 1600 : 4096}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">
                {messageType === "sms" ? "SMS (1600 chars max)" : "WhatsApp (4096 chars max)"}
              </span>
              <span className={`text-xs ${message.length > (messageType === "sms" ? 1600 : 4096) ? 'text-red-600' : 'text-gray-500'}`}>
                {message.length}/{(messageType === "sms" ? 1600 : 4096)}
              </span>
            </div>
          </div>

          {/* Character Count Warning */}
          {message.length > 160 && messageType === "sms" && (
            <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ SMS messages over 160 characters may be split into multiple messages.
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSendMessage}
              disabled={loading || !message.trim()}
              className={`flex-1 px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${loading || !message.trim()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : messageType === "sms"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="w-5 h-5" />
                  Send {messageType.toUpperCase()}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingModal;