import { useEffect, useState, useRef } from 'react';
import { useTemplateStore } from '../store/templateStore';
import { scenarios } from '../data/scenarios';
import type { PromptTemplate } from '../types';
import AdPlaceholder from '../components/AdPlaceholder';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';

const emptyForm = (scenarioId: string): Omit<PromptTemplate, 'id' | 'isBuiltIn' | 'useCount' | 'createdAt'> => ({
  scenarioId,
  title: '',
  content: '',
  tags: [],
});

export default function MyTemplatesPage() {
  const { allTemplates, loadTemplates, addTemplate, updateTemplate, deleteTemplate } =
    useTemplateStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm(scenarios[0].id));
  const [tagInput, setTagInput] = useState('');
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  const insertPlaceholder = () => {
    const el = contentTextareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = form.content;
    const before = text.slice(0, start);
    const selection = text.slice(start, end);
    const after = text.slice(end);
    // 选中文字则包裹，否则插入带示例文字的占位符
    const placeholder = selection ? `{{${selection}}}` : '{{占位符}}';
    const newText = before + placeholder + after;
    setForm({ ...form, content: newText });
    // 光标放占位符之后
    requestAnimationFrame(() => {
      el.focus();
      const cursor = before.length + placeholder.length;
      el.setSelectionRange(cursor, cursor);
    });
  };

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const userTemplates = allTemplates.filter((t) => !t.isBuiltIn);

  const resetForm = () => {
    setForm(emptyForm(scenarios[0].id));
    setTagInput('');
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (t: PromptTemplate) => {
    setForm({ scenarioId: t.scenarioId, title: t.title, content: t.content, tags: [...t.tags] });
    setEditingId(t.id);
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!form.title.trim() || !form.content.trim()) return;

    if (editingId) {
      const existing = allTemplates.find((t) => t.id === editingId);
      if (existing) {
        updateTemplate({ ...existing, ...form });
      }
    } else {
      addTemplate({
        ...form,
        id: `user-${Date.now()}`,
        isBuiltIn: false,
        useCount: 0,
        createdAt: new Date().toISOString(),
      });
    }
    resetForm();
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      setForm({ ...form, tags: [...form.tags, t] });
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setForm({ ...form, tags: form.tags.filter((x) => x !== tag) });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">我的模板</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          <Plus size={16} />
          新建模板
        </button>
      </div>

      {/* 模板表单 */}
      {showForm && (
        <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
          <h2 className="font-medium text-gray-700 mb-4">
            {editingId ? '编辑模板' : '新建模板'}
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">所属场景</label>
              <select
                value={form.scenarioId}
                onChange={(e) => setForm({ ...form, scenarioId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {scenarios.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.icon} {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">模板名称</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="例如：数学教案设计"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                模板内容（用 {'{{占位符}}'} 标记需填写部分）
              </label>
              <textarea
                ref={contentTextareaRef}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={6}
                placeholder={`你是一位经验丰富的{{学科}}教师，请为{{年级}}...`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
              <button
                type="button"
                onClick={insertPlaceholder}
                className="mt-1.5 inline-flex items-center gap-1 px-2 py-1 text-xs rounded border border-dashed border-blue-300 text-blue-500 hover:bg-blue-50 transition-colors"
              >
                + 插入占位符
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">标签</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="输入标签后按回车"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={addTag}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  添加
                </button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {form.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded bg-white border border-gray-200"
                    >
                      {tag}
                      <button onClick={() => removeTag(tag)}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              <Check size={16} />
              {editingId ? '保存修改' : '创建模板'}
            </button>
            <button
              onClick={resetForm}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* 模板列表 */}
      {userTemplates.length === 0 && !showForm ? (
        <div className="text-center py-16 text-gray-400">
          <p>还没有自定义模板，点击上方按钮创建</p>
        </div>
      ) : (
        <div className="space-y-3">
          {userTemplates.map((t, i) => {
            const scenario = scenarios.find((s) => s.id === t.scenarioId);
            return (
              <div key={t.id}>
                <div className="p-4 rounded-lg border border-gray-200 bg-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-800">{t.title}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {scenario?.icon} {scenario?.name} · 使用 {t.useCount} 次
                    </p>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2 whitespace-pre-wrap">
                      {t.content}
                    </p>
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {t.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-500">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-1 ml-3">
                    <button
                      onClick={() => startEdit(t)}
                      className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-blue-500"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('确定删除此模板？')) deleteTemplate(t.id);
                      }}
                      className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
              {(i + 1) % 2 === 0 && i + 1 < userTemplates.length && (
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
