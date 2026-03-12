import React from 'react';
import { History, MessageSquare, Trash2, Plus } from 'lucide-react';
import { ChatMessage } from './ChatPanel';

export interface ChatSession {
  id: string;
  featureName: string;
  timestamp: Date;
  messages: ChatMessage[];
  stage: string;
  competitorData?: any;
  mrdData?: any;
  frdData?: any;
  designData?: any;
  figmaLink?: string;
}

interface ChatHistoryProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onLoadSession: (session: ChatSession) => void;
  onDeleteSession: (sessionId: string) => void;
  onNewChat: () => void;
}

export function ChatHistory({
  sessions,
  currentSessionId,
  onLoadSession,
  onDeleteSession,
  onNewChat,
}: ChatHistoryProps) {
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const formatDate = (date: Date) => {
    const now = new Date();
    const sessionDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - sessionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return sessionDate.toLocaleDateString();
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-purple-600" />
            <h3 className="text-gray-900">Chat History</h3>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-2">
        {sortedSessions.length === 0 ? (
          <div className="text-center py-8 px-4">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No chat history yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Start a new feature chat to begin
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedSessions.map((session) => (
              <div
                key={session.id}
                className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                  currentSessionId === session.id
                    ? 'bg-purple-50 border-2 border-purple-200'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
                onClick={() => onLoadSession(session)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm text-gray-900 truncate mb-1">
                      {session.featureName || 'Untitled Feature'}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{formatDate(session.timestamp)}</span>
                      <span>•</span>
                      <span className="capitalize">{session.stage.replace('-', ' ')}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 truncate">
                      {session.messages.length} messages
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Footer */}
      {sortedSessions.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            {sortedSessions.length} feature{sortedSessions.length !== 1 ? 's' : ''} in history
          </p>
        </div>
      )}
    </div>
  );
}