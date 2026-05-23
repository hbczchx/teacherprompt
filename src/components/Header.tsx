import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut } from 'lucide-react';
import { getCurrentUser, clearCurrentUser } from '../pages/LoginPage';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();

  if (location.pathname === '/login') return null;

  const links = [
    { to: '/', label: '首页' },
    { to: '/my-templates', label: '我的模板' },
    { to: '/history', label: '历史记录' },
  ];

  const handleLogout = () => {
    clearCurrentUser();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-blue-600 no-underline">
          <BookOpen size={24} />
          <span>教师提示词助手</span>
        </Link>
        <div className="flex items-center gap-3">
          <nav className="flex gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 py-1.5 rounded text-sm no-underline transition-colors ${
                  location.pathname === l.to
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <span className="text-xs text-gray-400 border-l border-gray-200 pl-3 ml-1">
            {user ? user.slice(0, 3) + '****' + user.slice(7) : ''}
          </span>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded text-gray-400 hover:text-red-400 hover:bg-red-50 transition-colors"
            title="退出登录"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
