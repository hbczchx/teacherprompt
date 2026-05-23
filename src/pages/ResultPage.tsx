import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTemplateStore } from '../store/templateStore';
import { useHistoryStore } from '../store/historyStore';
import Steps from '../components/Steps';
import PromptPreview from '../components/PromptPreview';
import CopyButton from '../components/CopyButton';
import { ArrowLeft, RotateCcw, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const aiTools = [
  { name: 'DeepSeek', url: 'https://chat.deepseek.com', color: 'bg-blue-500 hover:bg-blue-600' },
  { name: '豆包', url: 'https://www.doubao.com/chat', color: 'bg-emerald-500 hover:bg-emerald-600' },
  { name: 'Kimi', url: 'https://kimi.moonshot.cn', color: 'bg-violet-500 hover:bg-violet-600' },
  { name: '通义千问', url: 'https://tongyi.aliyun.com/qianwen', color: 'bg-orange-500 hover:bg-orange-600' },
  { name: '文心一言', url: 'https://yiyan.baidu.com', color: 'bg-sky-500 hover:bg-sky-600' },
];

async function copyAndOpen(text: string, url: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success('已复制到剪贴板，正在打开...');
  } catch {
    // 复制失败仍打开网页
  }
  window.open(url, '_blank');
}

export default function ResultPage() {
  const navigate = useNavigate();
  const {
    allTemplates,
    selectedIds,
    filledValues,
    generatedContents,
    incrementUseCount,
    resetEditor,
    loadTemplates,
  } = useTemplateStore();
  const { add, load } = useHistoryStore();

  // 可编辑的内容副本
  const [editedContents, setEditedContents] = useState<Record<string, string>>({});

  useEffect(() => {
    loadTemplates();
    load();
    if (Object.keys(generatedContents).length === 0) {
      navigate('/');
      return;
    }
    incrementUseCount(selectedIds);
    // 初始化编辑副本
    setEditedContents({ ...generatedContents });
  }, []);

  const selectedTemplates = allTemplates.filter((t) => selectedIds.includes(t.id));

  const handleSaveHistory = () => {
    add({
      id: Date.now().toString(),
      templateIds: selectedIds,
      filledValues,
      generatedContents: editedContents,
      createdAt: new Date().toISOString(),
    });
    toast.success('已保存到历史记录');
  };

  const handleStartOver = () => {
    resetEditor();
    navigate('/');
  };

  const allText = selectedTemplates
    .map((t) => editedContents[t.id] || generatedContents[t.id])
    .filter(Boolean)
    .join('\n\n---\n\n');

  return (
    <div>
      <Steps current={3} />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">生成结果</h1>
        <div className="flex gap-2">
          <CopyButton text={allText} label="全部复制" />
          <button
            onClick={handleSaveHistory}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            保存到历史
          </button>
        </div>
      </div>

      {/* 可编辑的提示词 */}
      <div className="space-y-6">
        {selectedTemplates.map((template) => (
          <div key={template.id}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-700">{template.title}</h3>
              <CopyButton text={editedContents[template.id] || generatedContents[template.id] || ''} />
            </div>
            <PromptPreview
              content={editedContents[template.id] || generatedContents[template.id] || ''}
              onChange={(val) =>
                setEditedContents((prev) => ({ ...prev, [template.id]: val }))
              }
            />
          </div>
        ))}
      </div>

      {/* AI工具快捷入口 */}
      <div className="mt-8 p-5 bg-gray-50 rounded-xl border border-gray-200">
        <h3 className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-1.5">
          <ExternalLink size={16} />
          发送到AI工具（自动复制并打开）
        </h3>
        <div className="flex flex-wrap gap-2">
          {aiTools.map((tool) => (
            <button
              key={tool.name}
              onClick={() => copyAndOpen(allText, tool.url)}
              className={`px-4 py-2 text-sm text-white rounded-lg transition-colors ${tool.color}`}
            >
              打开{tool.name}
            </button>
          ))}
        </div>
      </div>

      {/* 底部操作 */}
      <div className="mt-8 flex justify-center gap-3">
        <button
          onClick={() => navigate('/editor')}
          className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={16} />
          返回修改
        </button>
        <button
          onClick={handleStartOver}
          className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-gray-800 text-white hover:bg-gray-900 transition-colors"
        >
          <RotateCcw size={16} />
          重新开始
        </button>
      </div>
    </div>
  );
}
