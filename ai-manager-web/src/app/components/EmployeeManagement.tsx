'use client';

import { useEmployees } from '../hooks/useApi';
import { StatCard, Card, LoadingSpinner, ErrorState, Badge, Button } from './ui';
import { PageHeader, StatsGrid, DataTable } from './layout';
import { Employee } from '../types';
import PageChatSection from '@/components/PageChatSection';

const EmployeeManagement = () => {
  const { data: employees, loading, error, refetch } = useEmployees();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  const activeEmployees = employees.filter(emp => emp.status === 'Active');
  const departments = new Set(employees.map(emp => emp.department));

  const columns = [
    { key: 'employee', label: 'Employee' },
    { key: 'position', label: 'Position' },
    { key: 'department', label: 'Department' },
    { key: 'status', label: 'Status' },
    { key: 'salary', label: 'Salary' },
    { key: 'actions', label: 'Actions' }
  ];

  const renderCell = (employee: Employee, column: string) => {
    switch (column) {
      case 'employee':
        return (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">
                {employee.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <div className="font-medium text-gray-900">{employee.name}</div>
              <div className="text-sm text-gray-500">{employee.email}</div>
            </div>
          </div>
        );
      case 'position':
        return <span className="text-gray-900">{employee.position}</span>;
      case 'department':
        return <span className="text-gray-900">{employee.department}</span>;
      case 'status':
        return (
          <Badge variant={employee.status === 'Active' ? 'success' : 'error'}>
            {employee.status}
          </Badge>
        );
      case 'salary':
        return <span className="font-medium">${employee.salary?.toLocaleString()}</span>;
      case 'actions':
        return (
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm">Edit</Button>
            <Button variant="ghost" size="sm">Delete</Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Employee Management" 
        description="Manage your team members and their information"
        action={<Button>+ Add Employee</Button>}
      />

      {/* AI Assistant */}
      <PageChatSection category="employees" title="HR Assistant" />

      {/* Stats */}
      <StatsGrid columns={3}>
        <StatCard
          title="Total Employees"
          value={employees.length}
          icon="👥"
          trend={`${activeEmployees.length} active`}
          color="blue"
        />
        <StatCard
          title="Active Employees"
          value={activeEmployees.length}
          icon="✅"
          trend={`${Math.round((activeEmployees.length / employees.length) * 100)}% active rate`}
          color="green"
        />
        <StatCard
          title="Departments"
          value={departments.size}
          icon="🏢"
          trend="Across organization"
          color="purple"
        />
      </StatsGrid>

      {/* Employee Cards for Mobile */}
      <div className="block md:hidden space-y-4">
        {employees.map((employee) => (
          <Card key={employee._id} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {employee.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                  <p className="text-sm text-gray-600">{employee.email}</p>
                </div>
              </div>
              <Badge variant={employee.status === 'Active' ? 'success' : 'error'} size="sm">
                {employee.status}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Position:</span>
                <span className="ml-2 font-medium">{employee.position}</span>
              </div>
              <div>
                <span className="text-gray-500">Department:</span>
                <span className="ml-2 font-medium">{employee.department}</span>
              </div>
              <div>
                <span className="text-gray-500">Salary:</span>
                <span className="ml-2 font-medium">${employee.salary?.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-500">Hire Date:</span>
                <span className="ml-2 font-medium">
                  {new Date(employee.hireDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t">
              <Button variant="ghost" size="sm">Edit</Button>
              <Button variant="ghost" size="sm">View Profile</Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <DataTable<Employee>
          columns={columns}
          data={employees}
          renderCell={renderCell}
        />
      </div>
    </div>
  );
};

export default EmployeeManagement;