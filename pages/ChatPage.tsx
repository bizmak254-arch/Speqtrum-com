
import React from 'react';
import ChatSection from '../components/ChatSection';

interface ChatPageProps {
  initialUserId?: string | null;
  onChatConsumed?: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ initialUserId, onChatConsumed }) => {
  return (
    <div className="h-full">
      <ChatSection initialUserId={initialUserId} onChatConsumed={onChatConsumed} />
    </div>
  );
};

export default ChatPage;
