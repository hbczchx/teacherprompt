import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTemplateStore } from '../store/templateStore';
import Steps from '../components/Steps';
import InlinePromptEditor from '../components/InlinePromptEditor';
import AdPlaceholder from '../components/AdPlaceholder';
import { fillTemplate } from '../utils/placeholder';
import { Sparkles } from 'lucide-react';

export default function EditorPage() {
  const navigate = useNavigate();
  const {
    allTemplates,
    selectedIds,
    filledValues,
    setFilledValues,
    setGeneratedContents,
    loadTemplates,
  } = useTemplateStore();

  useEffect(() => {
    loadTemplates();
    if (selectedIds.length === 0) {
      navigate('/');
    }
  }, [loadTemplates, selectedIds.length, navigate]);

  const selectedTemplates = allTemplates.filter((t) => selectedIds.includes(t.id));

  const handleGenerate = () => {
    const contents: Record<string, string> = {};
    for (const t of selectedTemplates) {
      const vals = filledValues[t.id] || {};
      contents[t.id] = fillTemplate(t.content, vals);
    }
    setGeneratedContents(contents);

    const recent = JSON.parse(localStorage.getItem('teacherprompt:recent') || '[]') as string[];
    const merged = [...new Set([...selectedIds, ...recent])].slice(0, 10);
    localStorage.setItem('teacherprompt:recent', JSON.stringify(merged));

    navigate('/result');
  };

  return (
    <div>
      <Steps current={2} />

      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-gray-800 mb-1">完善提示词</h1>
        <p className="text-sm text-gray-400">
          在文中空白处填入个性化信息，未填写的部分将自动使用通用话术
        </p>
      </div>

      <div className="space-y-6 mb-24">
        {selectedTemplates.map((template) => (
          <InlinePromptEditor
            key={template.id}
            template={template}
            values={filledValues[template.id] || {}}
            onChange={(values) => setFilledValues(template.id, values)}
          />
        ))}
      </div>

      <AdPlaceholder size="banner" className="mb-6" />

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border border-gray-200 px-6 py-3 rounded-full shadow-lg flex items-center gap-4 z-50">
        <span className="text-sm text-gray-400">
          {selectedTemplates.length} 个模板 · 未填项将自动补全
        </span>
        <button
          onClick={handleGenerate}
          className="flex items-center gap-1.5 px-5 py-2 rounded-full text-sm text-white font-medium bg-blue-500 hover:bg-blue-600 transition-colors shadow-sm"
        >
          <Sparkles size={16} />
          生成提示词
        </button>
      </div>
    </div>
  );
}
