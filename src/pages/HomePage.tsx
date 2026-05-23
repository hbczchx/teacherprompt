import { useEffect, useState } from 'react';
import { scenarios } from '../data/scenarios';
import { useTemplateStore } from '../store/templateStore';
import ScenarioCard from '../components/ScenarioCard';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const { loadTemplates, allTemplates } = useTemplateStore();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const filtered = scenarios.filter(
    (s) =>
      s.name.includes(search) ||
      s.description.includes(search)
  );

  const recentIds = JSON.parse(localStorage.getItem('teacherprompt:recent') || '[]') as string[];
  const recentTemplates = recentIds
    .map((id) => allTemplates.find((t) => t.id === id))
    .filter(Boolean);

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">选择教学场景</h1>
        <p className="text-gray-500">选择场景后，系统将为您推荐对应的提示词模板</p>
      </div>

      {/* 搜索框 */}
      <div className="relative mb-8 max-w-md mx-auto">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索场景..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* 场景卡片网格 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {filtered.map((s) => (
          <ScenarioCard key={s.id} scenario={s} />
        ))}
      </div>

      {/* 最近使用 */}
      {recentTemplates.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">最近使用的模板</h2>
          <div className="space-y-2">
            {recentTemplates.map((t) => (
              <button
                key={t!.id}
                onClick={() => {
                  const store = useTemplateStore.getState();
                  if (!store.selectedIds.includes(t!.id)) {
                    store.toggleSelect(t!.id);
                  }
                  navigate(`/scenario/${t!.scenarioId}`);
                }}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">{t!.title}</span>
                <span className="text-xs text-gray-400 ml-2">{t!.tags.join('、')}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
