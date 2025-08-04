// src/components/Navbar.tsx
import { useState, useEffect } from 'react';
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
  User,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) setIsOpen(true); // Always open on desktop
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Hamburger Button */}
      {isMobile && (
        <button 
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md lg:hidden"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Sidebar */}
      <nav className={cn(
        "bg-white border-r border-gray-200 w-64 min-h-screen flex flex-col fixed lg:relative z-60 transition-all duration-300",
        isMobile ? (isOpen ? 'left-0' : '-left-64') : ''
      )}>
        {/* Close button for mobile */}
        {isMobile && isOpen && (
          <button 
            onClick={toggleSidebar}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        )}

        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">IF</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Intern Fund</h1>
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              if (item.adminOnly && user?.role !== 'admin') return null;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => isMobile && setIsOpen(false)}
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
            <Button 
              className="w-full mt-6" 
              onClick={() => {
                navigate('/admin/create-campaign');
                isMobile && setIsOpen(false);
              }}
            >
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

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;