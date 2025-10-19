'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardOverview from './DashboardOverview';
import EmployeeManagement from './EmployeeManagement';
import InventoryManagement from './InventoryManagement';
import ProjectManagement from './ProjectManagement';
import FinanceManagement from './FinanceManagement';
import ChatPage from './pages/ChatPage';
import AIAssistantPage from './pages/AIAssistantPage';
import { MobileLayout } from './layout';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'employees':
        return <EmployeeManagement />;
      case 'inventory':
        return <InventoryManagement />;
      case 'projects':
        return <ProjectManagement />;
      case 'finance':
        return <FinanceManagement />;
      case 'ai-assistant':
        return <AIAssistantPage />;
      case 'chat':
        return <ChatPage />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <MobileLayout
      sidebar={<Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />}
      header={<Header activeTab={activeTab} />}
    >
      {renderContent()}
    </MobileLayout>
  );
};

export default Dashboard;