import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTemplateStore } from '../store/templateStore';
import Steps from '../components/Steps';
import InlinePromptEditor from '../components/InlinePromptEditor';
import AdPlaceholder from '../components/AdPlaceholder';
import { fillTemplate } from '../utils/placeholder';
import { Sparkles, Edit3 } from 'lucide-react';

export default function EditorPage() {
  const navigate = useNavigate();
  const {
    allTemplates,
    selectedId,
    filledValues,
    setFilledValues,
    setGeneratedContent,
    loadTemplates,
  } = useTemplateStore();

  const [globalEdit, setGlobalEdit] = useState(false);
  const [freeText, setFreeText] = useState('');

  useEffect(() => {
    loadTemplates();
    if (!selectedId) {
      navigate('/');
    }
  }, [loadTemplates, selectedId, navigate]);

  const template = allTemplates.find((t) => t.id === selectedId);

  const switchToGlobalEdit = () => {
    if (!template) return;
    const currentValues = filledValues || {};
    const preFilled = fillTemplate(template.content, currentValues);
    setFreeText(preFilled);
    setGlobalEdit(true);
  };

  const handleGenerate = () => {
    if (!template) return;
    let content: string;
    if (globalEdit) {
      content = freeText.trim();
    } else {
      content = fillTemplate(template.content, filledValues);
    }
    setGeneratedContent(content);

    const recent = JSON.parse(localStorage.getItem('teacherprompt:recent') || '[]') as string[];
    const merged = [...new Set([selectedId, ...recent])].slice(0, 10);
    localStorage.setItem('teacherprompt:recent', JSON.stringify(merged));

    navigate('/result');
  };

  if (!template) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p>未找到模板</p>
        <button onClick={() => navigate('/')} className="text-blue-500 text-sm mt-2 hover:underline">
          返回首页
        </button>
      </div>
    );
  }

  return (
    <div>
      <Steps current={2} />

      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-gray-800 mb-1">完善提示词</h1>
        <p className="text-sm text-gray-400">
          {globalEdit
            ? '自由编辑模式，可直接修改任意内容'
            : '在文中空白处填入个性化信息，未填部分自动补全'}
        </p>
      </div>

      {/* 自由编辑开关 */}
      <div className="flex justify-end mb-3">
        <button
          onClick={() => {
            if (globalEdit) {
              setGlobalEdit(false);
            } else {
              switchToGlobalEdit();
            }
          }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors ${
            globalEdit
              ? 'border-amber-300 bg-amber-50 text-amber-600'
              : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Edit3 size={14} />
          {globalEdit ? '退出自由编辑' : '自由编辑'}
        </button>
      </div>

      {/* 编辑区 */}
      {globalEdit ? (
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-24">
          <textarea
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            rows={12}
            className="w-full border-0 outline-none resize-none text-sm leading-relaxed text-gray-700"
            placeholder="在此自由编辑提示词..."
          />
        </div>
      ) : (
        <div className="mb-24">
          <InlinePromptEditor
            template={template}
            values={filledValues}
            onChange={setFilledValues}
          />
        </div>
      )}

      <AdPlaceholder size="banner" className="mb-6" />

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border border-gray-200 px-6 py-3 rounded-full shadow-lg flex items-center gap-4 z-50">
        <span className="text-sm text-gray-400">
          {template.title} · 未填项将自动补全
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
