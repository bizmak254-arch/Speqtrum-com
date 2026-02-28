
import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const MOCK_REPORTS = [
  { id: 'r1', user: 'User99', reason: 'Harassment', risk: 85, status: 'Urgent', content: 'Inappropriate language in public group' },
  { id: 'r2', user: 'Shadow_X', reason: 'Underage Suspicion', risk: 92, status: 'Pending', content: 'Verification image mismatch' },
  { id: 'r3', user: 'VibeCheck', reason: 'Spam', risk: 45, status: 'Resolved', content: 'Bulk messaging detected' },
];

const MOCK_SUB_DATA = [
  { name: 'Mon', subs: 400 },
  { name: 'Tue', subs: 600 },
  { name: 'Wed', subs: 550 },
  { name: 'Thu', subs: 900 },
  { name: 'Fri', subs: 1100 },
  { name: 'Sat', subs: 1400 },
  { name: 'Sun', subs: 1800 },
];

interface AdminDashboardProps {
  onBack?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-start">
        {onBack && (
          <button 
            onClick={onBack}
            className="group flex items-center space-x-2 text-gray-500 hover:text-white transition-colors"
          >
            <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
            <span className="text-[10px] font-black uppercase tracking-widest">Exit Admin</span>
          </button>
        )}
      </div>

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black mb-2 flex items-center">
            <i className="fa-solid fa-gauge-high text-red-500 mr-4"></i>
            Moderation Command Center
          </h1>
          <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">Abuse Detection Engine • Active Governance</p>
        </div>
        <div className="flex items-center space-x-3">
           <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl">
              <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">High Risk Alerts: 2</span>
           </div>
        </div>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Users', value: '12.4k', icon: 'fa-users', color: 'text-blue-400' },
          { label: 'Reports (24h)', value: '18', icon: 'fa-flag', color: 'text-red-400' },
          { label: 'AI Blocks', value: '442', icon: 'fa-robot', color: 'text-purple-400' },
          { label: 'Verified Today', value: '156', icon: 'fa-id-card', color: 'text-green-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl">
            <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${stat.color}`}>
              <i className={`fa-solid ${stat.icon}`}></i>
            </div>
            <p className="text-2xl font-black">{stat.value}</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Subscription Chart */}
      <div className="bg-zinc-900 border border-white/10 p-8 rounded-[2.5rem] shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-black italic">Subscription Growth</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Weekly Gold Conversions</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span className="text-[10px] font-black uppercase text-gray-400">Gold Tier</span>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_SUB_DATA}>
              <defs>
                <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#4b5563" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tick={{ fontWeight: 'bold' }}
              />
              <YAxis 
                stroke="#4b5563" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tick={{ fontWeight: 'bold' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#18181b', 
                  border: '1px solid #3f3f46', 
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
                itemStyle={{ color: '#3b82f6' }}
              />
              <Area 
                type="monotone" 
                dataKey="subs" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorSubs)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <h3 className="font-bold">Pending Reports</h3>
          <button className="text-xs font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors">View All Archive</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5">
                <th className="p-6">Target User</th>
                <th className="p-6">Reason</th>
                <th className="p-6">AI Risk Score</th>
                <th className="p-6">Status</th>
                <th className="p-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MOCK_REPORTS.map((report) => (
                <tr key={report.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-6 flex items-center space-x-3">
                    <img src={`https://picsum.photos/seed/${report.user}/40`} className="w-8 h-8 rounded-full" />
                    <span className="font-bold text-sm">@{report.user}</span>
                  </td>
                  <td className="p-6 text-sm text-gray-400">{report.reason}</td>
                  <td className="p-6">
                    <div className="flex items-center space-x-2">
                      <div className="h-1.5 w-16 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${report.risk > 80 ? 'bg-red-500' : 'bg-yellow-500'}`} 
                          style={{ width: `${report.risk}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs font-black ${report.risk > 80 ? 'text-red-400' : 'text-yellow-400'}`}>{report.risk}%</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                      report.status === 'Urgent' ? 'bg-red-500/20 text-red-400' : 
                      report.status === 'Resolved' ? 'bg-green-500/20 text-green-400' : 
                      'bg-white/10 text-gray-400'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><i className="fa-solid fa-ban"></i></button>
                      <button className="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all"><i className="fa-solid fa-check"></i></button>
                      <button className="w-8 h-8 rounded-lg bg-white/5 text-gray-400 flex items-center justify-center hover:bg-white/10 transition-all"><i className="fa-solid fa-ellipsis"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
