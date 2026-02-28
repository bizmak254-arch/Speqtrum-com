import React from 'react';
import CommunityHub from '../components/CommunityHub';
import { CommunityGroup } from '../types';

// Define props for CommunityPage to accept the onJoin handler
interface CommunityPageProps {
  onJoin?: (group: CommunityGroup) => void;
}

const CommunityPage: React.FC<CommunityPageProps> = ({ onJoin }) => {
  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      {/* Pass onJoin to the underlying hub component */}
      <CommunityHub onJoin={onJoin} />
    </div>
  );
};

export default CommunityPage;