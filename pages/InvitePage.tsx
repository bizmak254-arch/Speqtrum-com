
import React from 'react';
import InviteFriends from '../components/InviteFriends';

interface InvitePageProps {
  onBack?: () => void;
}

const InvitePage: React.FC<InvitePageProps> = ({ onBack }) => {
  return (
    <div className="h-full overflow-y-auto no-scrollbar pb-24">
      <InviteFriends onBack={onBack} />
    </div>
  );
};

export default InvitePage;
