import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { scenarios } from '../data/scenarios';
import { useTemplateStore } from '../store/templateStore';
import TemplateCard from '../components/TemplateCard';
import AdPlaceholder from '../components/AdPlaceholder';
import { ArrowLeft } from 'lucide-react';

export default function TemplateListPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { allTemplates, loadTemplates } = useTemplateStore();

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const scenario = useMemo(() => scenarios.find((s) => s.id === id), [id]);

  const templates = useMemo(
    () => allTemplates.filter((t) => t.scenarioId === id),
    [allTemplates, id]
  );

  if (!scenario) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 mb-4">未找到该场景</p>
        <button onClick={() => navigate('/')} className="text-blue-500 text-sm hover:underline">
          返回首页
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-3 transition-colors"
        >
          <ArrowLeft size={16} />
          返回场景列表
        </button>
        <div className="flex items-center gap-3">
          <span className="text-4xl">{scenario.icon}</span>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{scenario.name}</h1>
            <p className="text-sm text-gray-500">{scenario.description}</p>
          </div>
        </div>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p>该场景暂无模板</p>
        </div>
      ) : (
        <div className="space-y-3 pb-8">
          {templates.map((t, i) => (
            <div key={t.id}>
              <TemplateCard template={t} />
              {(i + 1) % 3 === 0 && i + 1 < templates.length && (
                <AdPlaceholder size="inline" className="mt-3" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
