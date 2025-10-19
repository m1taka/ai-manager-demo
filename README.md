# AI Manager - Business Management System

A comprehensive business management system built with Next.js frontend and Node.js backend, showcasing employee management, inventory tracking, project oversight, and financial monitoring capabilities.

## 🚀 Features

### Dashboard Overview
- Real-time business metrics and KPIs
- System alerts and notifications
- Recent activity tracking
- Department performance overview

### Employee Management
- Employee directory with detailed profiles
- Attendance tracking
- Department organization
- Role and salary management

### Inventory Management
- Stock level monitoring
- Low stock and out-of-stock alerts
- Category-based organization
- Supplier tracking
- Automated reorder points

### Project Management
- Project timeline tracking
- Budget monitoring and utilization
- Team assignment and collaboration
- Progress visualization
- Status management (Planning, In Progress, Completed)

### Finance Management
- Revenue and expense tracking
- Profit margin analysis
- Cash flow monitoring
- Transaction history
- Financial health indicators

## 🛠️ Tech Stack

### Frontend (ai-manager-web)
- **Next.js 15.5.6** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **ESLint** - Code linting

### Backend (backend)
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **Nodemon** - Development auto-restart

## 📁 Project Structure

```
ai-manager-demo/
├── ai-manager-web/          # Next.js Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # React components
│   │   │   ├── globals.css   # Global styles
│   │   │   ├── layout.tsx    # Root layout
│   │   │   └── page.tsx      # Home page
│   │   └── ...
│   ├── public/              # Static assets
│   ├── package.json
│   └── ...
├── backend/                 # Node.js Backend
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── config/          # Configuration & demo data
│   │   └── index.js         # Server entry point
│   ├── .env                 # Environment variables
│   ├── package.json
│   └── ...
└── .github/
    └── copilot-instructions.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-manager-demo
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../ai-manager-web
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cd ../backend
   cp .env.example .env
   # Edit .env file as needed
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   # Server runs on http://localhost:5000
   ```

2. **Start the frontend development server**
   ```bash
   cd ai-manager-web
   npm run dev
   # Frontend runs on http://localhost:3000
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📊 API Endpoints

### Dashboard
- `GET /api/dashboard` - Get dashboard overview
- `GET /api/dashboard/analytics` - Get analytics data
- `GET /api/dashboard/notifications` - Get system notifications

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get single employee
- `POST /api/employees` - Add new employee (demo)
- `PUT /api/employees/:id` - Update employee (demo)
- `DELETE /api/employees/:id` - Delete employee (demo)

### Inventory
- `GET /api/inventory` - Get all inventory items
- `GET /api/inventory/:id` - Get single item
- `GET /api/inventory/alerts/low-stock` - Get low stock items
- `POST /api/inventory` - Add new item (demo)
- `PUT /api/inventory/:id` - Update item (demo)
- `DELETE /api/inventory/:id` - Delete item (demo)

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `GET /api/projects/stats/overview` - Get project statistics
- `POST /api/projects` - Create new project (demo)
- `PUT /api/projects/:id` - Update project (demo)
- `DELETE /api/projects/:id` - Delete project (demo)

### Finance
- `GET /api/finance` - Get all finance records
- `GET /api/finance/overview` - Get financial overview
- `GET /api/finance/reports/monthly` - Get monthly report
- `POST /api/finance` - Add finance record (demo)
- `PUT /api/finance/:id` - Update record (demo)
- `DELETE /api/finance/:id` - Delete record (demo)

## 🎨 Demo Data

The application uses predefined demo data located in `backend/src/config/demoData.js`, including:

- **3 Demo Employees** - John Smith, Sarah Johnson, Mike Chen
- **3 Inventory Items** - Office Chairs, Laptops, Coffee Beans
- **2 Sample Projects** - Website Redesign, Mobile App Development
- **Financial Records** - Revenue, expenses, and transaction history

## 🔧 Development Features

- **Hot Reload** - Both frontend and backend support hot reloading
- **TypeScript Support** - Full TypeScript integration in frontend
- **ESLint Configuration** - Code quality and consistency
- **CORS Enabled** - Cross-origin requests between frontend and backend
- **Environment Variables** - Configurable settings
- **Error Handling** - Comprehensive error handling and user feedback

## 📝 Project Notes

This is a **business management demonstration** showcasing:
- Full-stack development capabilities
- Modern React/Next.js frontend development
- RESTful API design and implementation
- Business application UI/UX design
- State management and data flow
- Responsive design principles
- Professional code organization and structure

### Demo Mode Features
- No real database - uses in-memory demo data
- All CRUD operations return success responses without persistence
- Designed for demonstration purposes
- Shows complete application flow and user interactions

## 🚀 Future Enhancements

Potential improvements for a production version:
- Database integration (MongoDB, PostgreSQL, etc.)
- User authentication and authorization
- Real-time notifications with WebSocket
- File upload and document management
- Advanced reporting and analytics
- Mobile app development
- Automated testing suite
- CI/CD pipeline integration

## 📄 License

This project is created for demonstration purposes.

## 👨‍💻 Developer

Created as a demonstration project showcasing full-stack development capabilities with modern web technologies.

---

**Note**: This is a demo application designed for showcase. All data is simulated and no real business data is stored or processed.