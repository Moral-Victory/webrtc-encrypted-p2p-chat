import React, { useState, useRef } from 'react';
import { Send, Paperclip, Smile, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const ChatWindow = ({ onSendMessage, onFileSelect, isConnected, isSending }) => {
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && isConnected && !isSending) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      e.target.value = '';
    }
  };

  return (
    <div className="p-4 bg-vscode-dark border-t border-vscode-border">
      <form onSubmit={handleSubmit} className="relative">
        {/* Connection Status Bar */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center space-x-2"
          >
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="text-sm text-red-300">No peers connected</span>
          </motion.div>
        )}

        <div className="relative flex items-end space-x-3">
          {/* File Upload Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleFileClick}
            disabled={!isConnected}
            className="flex-shrink-0 w-11 h-11 rounded-xl bg-vscode-card hover:bg-vscode-hover border border-vscode-border hover:border-metamask-orange/30 text-vscode-text-secondary hover:text-metamask-orange transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Paperclip size={20} />
          </motion.button>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Message Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={isConnected ? "Type your message..." : "Connect to peers first..."}
              disabled={!isConnected || isSending}
              className="chat-input pr-12"
            />
            
            {/* Encryption Indicator */}
            {isConnected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
              >
                <Lock size={16} className="text-metamask-orange" />
              </motion.div>
            )}
          </div>

          {/* Send Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!message.trim() || !isConnected || isSending}
            className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-r from-metamask-orange to-metamask-yellow hover:from-metamask-orange-dark hover:to-metamask-orange disabled:from-vscode-hover disabled:to-vscode-hover disabled:cursor-not-allowed text-vscode-dark transition-all flex items-center justify-center shadow-lg disabled:shadow-none"
          >
            {isSending ? (
              <div className="w-4 h-4 border-2 border-vscode-dark border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </motion.button>
        </div>

        {/* Helper Text */}
        {isConnected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 flex items-center space-x-4 text-xs text-vscode-text-muted"
          >
            <div className="flex items-center space-x-1">
              <div className="status-dot status-encrypted" />
              <span>End-to-end encrypted</span>
            </div>
            <span>•</span>
            <span>Press Enter to send</span>
          </motion.div>
        )}
      </form>
    </div>
  );
};

export default ChatWindow;
