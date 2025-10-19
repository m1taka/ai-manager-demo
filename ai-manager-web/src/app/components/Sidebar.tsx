'use client';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'employees', label: 'Employees', icon: '👥' },
    { id: 'inventory', label: 'Inventory', icon: '📦' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'finance', label: 'Finance', icon: '💰' },
    { id: 'ai-assistant', label: 'AI Assistant', icon: '🤖' },
    // { id: 'chat', label: 'Chat', icon: '💬' },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Logo/Brand */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">AI Manager</h1>
        <p className="text-sm text-gray-500 mt-1">Business System</p>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              activeTab === item.id
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      
      {/* User Profile */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            D
          </div>
          <div className="ml-3 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Demo User</p>
            <p className="text-xs text-gray-500 truncate">Demo Mode</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;