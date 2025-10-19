'use client';

interface HeaderProps {
  activeTab: string;
}

const Header = ({ activeTab }: HeaderProps) => {
  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'employees':
        return 'Employee Management';
      case 'inventory':
        return 'Inventory Management';
      case 'projects':
        return 'Project Management';
      case 'finance':
        return 'Finance Management';
      default:
        return 'AI Manager';
    }
  };

  const getPageDescription = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Monitor your business performance and key metrics';
      case 'employees':
        return 'Manage employee information and attendance';
      case 'inventory':
        return 'Track inventory levels and manage stock';
      case 'projects':
        return 'Oversee project progress and timelines';
      case 'finance':
        return 'Monitor financial performance and transactions';
      default:
        return 'Business management system';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{getPageTitle()}</h1>
          <p className="text-sm text-gray-600 mt-1">{getPageDescription()}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Demo Mode
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">D</span>
            </div>
            <span className="text-sm font-medium text-gray-700">Demo User</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;