// src/components/Navbar.tsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { 
  Home, 
  BarChart3, 
  Users, 
  Settings, 
  LogOut,
  PlusCircle,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/campaigns', icon: BarChart3, label: 'Campaigns' },
    { path: '/community', icon: Users, label: 'Community' },
    { path: '/admin', icon: Settings, label: 'Admin', adminOnly: true },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <nav className="bg-white border-r border-gray-200 w-64 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">IF</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Intern Fund</h1>
        </div>
      </div>
      
      <div className="flex-1 p-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            if (item.adminOnly && user?.role !== 'admin') return null;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all',
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
        
        {user?.role === 'admin' && (
          <Button className="w-full mt-6" onClick={() => navigate('/admin/create-campaign')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-4 px-4 py-3 rounded-lg bg-gray-50">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
          <div>
            <p className="font-medium">{user?.name || 'User'}</p>
            <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <LogOut size={20} />
          <span>Log out</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;