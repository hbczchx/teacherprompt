import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Props {
  selectedCount: number;
}

export default function FloatingBar({ selectedCount }: Props) {
  const navigate = useNavigate();

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-4 z-50">
      <span className="text-sm">已选择 {selectedCount} 个模板</span>
      <button
        onClick={() => navigate('/editor')}
        className="flex items-center gap-1.5 px-4 py-1.5 text-sm rounded-full bg-blue-500 hover:bg-blue-600 transition-colors"
      >
        去填写 <ArrowRight size={16} />
      </button>
    </div>
  );
}
