import { Link, useLocation } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function Header() {
  const location = useLocation();

  const links = [
    { to: '/', label: '首页' },
    { to: '/my-templates', label: '我的模板' },
    { to: '/history', label: '历史记录' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-blue-600 no-underline">
          <BookOpen size={24} />
          <span>教师提示词助手</span>
        </Link>
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
      </div>
    </header>
  );
}
