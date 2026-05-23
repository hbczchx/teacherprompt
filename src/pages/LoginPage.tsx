import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';

const PHONE_KEY = 'teacherprompt:user';

export function getCurrentUser(): string | null {
  return localStorage.getItem(PHONE_KEY);
}

export function setCurrentUser(phone: string) {
  localStorage.setItem(PHONE_KEY, phone);
}

export function clearCurrentUser() {
  localStorage.removeItem(PHONE_KEY);
}

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isValidPhone = (v: string) => /^1[3-9]\d{9}$/.test(v);

  const handleLogin = () => {
    const trimmed = phone.trim();
    if (!isValidPhone(trimmed)) {
      setError('请输入正确的11位手机号');
      return;
    }
    setCurrentUser(trimmed);
    navigate('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-sm mx-auto text-center">
        <div className="mb-8">
          <BookOpen size={48} className="mx-auto text-blue-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">教师提示词助手</h1>
          <p className="text-sm text-gray-400 mt-2">输入手机号开始使用</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value.replace(/\D/g, '').slice(0, 11));
              setError('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleLogin();
            }}
            placeholder="请输入手机号"
            maxLength={11}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            autoFocus
          />
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}

          <button
            onClick={handleLogin}
            disabled={phone.length < 11}
            className="mt-4 w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
          >
            开始使用 <ArrowRight size={18} />
          </button>

          <p className="text-xs text-gray-300 mt-4">
            手机号仅用于区分个人模板数据，不会外泄
          </p>
        </div>
      </div>
    </div>
  );
}
