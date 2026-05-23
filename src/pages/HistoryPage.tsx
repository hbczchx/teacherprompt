import { useEffect } from 'react';
import { useHistoryStore } from '../store/historyStore';
import { useTemplateStore } from '../store/templateStore';
import { useNavigate } from 'react-router-dom';
import CopyButton from '../components/CopyButton';
import AdPlaceholder from '../components/AdPlaceholder';
import { Trash2 } from 'lucide-react';

export default function HistoryPage() {
  const { histories, load, remove, clear } = useHistoryStore();
  const { allTemplates, loadTemplates } = useTemplateStore();
  const navigate = useNavigate();

  useEffect(() => {
    load();
    loadTemplates();
  }, [load, loadTemplates]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleReuse = (historyItem: typeof histories[0]) => {
    useTemplateStore.setState({
      selectedIds: historyItem.templateIds,
      filledValues: historyItem.filledValues,
      generatedContents: historyItem.generatedContents,
    });
    navigate('/result');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">历史记录</h1>
        {histories.length > 0 && (
          <button
            onClick={() => {
              if (confirm('确定清空所有历史记录？')) clear();
            }}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            清空全部
          </button>
        )}
      </div>

      {histories.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p>暂无历史记录</p>
        </div>
      ) : (
        <div className="space-y-3">
          {histories.map((h, i) => {
            const templates = h.templateIds
              .map((id) => allTemplates.find((t) => t.id === id))
              .filter(Boolean);

            const allText = templates
              .map((t) => h.generatedContents[t!.id])
              .filter(Boolean)
              .join('\n\n---\n\n');

            return (
              <div key={h.id}>
                <div className="p-4 rounded-lg border border-gray-200 bg-white">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs text-gray-400">{formatDate(h.createdAt)}</span>
                    <div className="flex gap-1.5 mt-1 flex-wrap">
                      {templates.map((t) => (
                        <span
                          key={t!.id}
                          className="px-2 py-0.5 text-xs rounded bg-blue-50 text-blue-600"
                        >
                          {t!.title}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <CopyButton text={allText} />
                    <button
                      onClick={() => handleReuse(h)}
                      className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      再次使用
                    </button>
                    <button
                      onClick={() => remove(h.id)}
                      className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded p-3 mt-2">
                  <pre className="text-sm text-gray-600 whitespace-pre-wrap font-sans leading-relaxed m-0 line-clamp-5">
                    {allText}
                  </pre>
                </div>
              </div>
              {(i + 1) % 2 === 0 && i + 1 < histories.length && (
                <AdPlaceholder size="inline" className="mt-3" />
              )}
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
