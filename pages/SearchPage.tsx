
import React from 'react';
import UserSearch from '../components/UserSearch';

interface SearchPageProps {
  onOpenChat: (userId: string) => void;
  onBack?: () => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ onOpenChat, onBack }) => {
  return (
    <div className="h-full overflow-y-auto no-scrollbar pb-24">
      <UserSearch onOpenChat={onOpenChat} onBack={onBack} />
    </div>
  );
};

export default SearchPage;
