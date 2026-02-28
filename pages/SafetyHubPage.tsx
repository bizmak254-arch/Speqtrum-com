
import React from 'react';
import SafetyHubView from '../components/SafetyHubView';

interface SafetyHubPageProps {
  onBack?: () => void;
}

const SafetyHubPage: React.FC<SafetyHubPageProps> = ({ onBack }) => {
  return (
    <div className="h-full overflow-y-auto no-scrollbar pb-24">
      <SafetyHubView onBack={onBack} />
    </div>
  );
};

export default SafetyHubPage;
