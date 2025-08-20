'use client';

import React, { useEffect, useState } from 'react';
import ChatbotWithOAuth from '../../../components/ChatbotWithOAuth';
import { useAuth } from '../../../contexts/AuthContext';

const ChatbotPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure user is authenticated
    if (user) {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading chatbot...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600">Please log in to access the chatbot.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Chatbot</h1>
              <p className="text-sm text-gray-600">
                Powered by Google Drive integration
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome, {user.email}</p>
              <p className="text-xs text-gray-500">User ID: {user.id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <ChatbotWithOAuth
            chatbotUrl="https://scalewize-production-chatbot-production.up.railway.app"
            userId={user.id}
            style={{
              height: '80vh',
              minHeight: '600px'
            }}
          />
        </div>
      </div>

      {/* Information Panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            🔐 Google Drive Integration
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Available Tools:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>search_file</strong> - Search for files in Google Drive</li>
                <li>• <strong>list_files</strong> - List files and folders</li>
                <li>• <strong>get_file_metadata</strong> - Get detailed file information</li>
                <li>• <strong>read_content</strong> - Read file content</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">How to Use:</h4>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. Start a conversation with the AI</li>
                <li>2. Ask to search or access your Google Drive files</li>
                <li>3. Complete OAuth authentication when prompted</li>
                <li>4. Use Google Drive tools seamlessly</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage; 