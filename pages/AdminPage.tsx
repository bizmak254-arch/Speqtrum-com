
import React from 'react';
import AdminDashboard from '../components/AdminDashboard';

interface AdminPageProps {
  onBack?: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onBack }) => {
  return (
    <div className="h-full overflow-y-auto no-scrollbar pb-24">
      <AdminDashboard onBack={onBack} />
    </div>
  );
};

export default AdminPage;
