import { useNavigate } from 'react-router-dom';
import { useTemplateStore } from '../store/templateStore';
import type { PromptTemplate } from '../types';
import { ArrowRight } from 'lucide-react';

interface Props {
  template: PromptTemplate;
}

export default function TemplateCard({ template }: Props) {
  const navigate = useNavigate();
  const selectTemplate = useTemplateStore((s) => s.selectTemplate);

  const handleGo = () => {
    selectTemplate(template.id);
    navigate('/editor');
  };

  return (
    <div
      onClick={handleGo}
      className="p-4 rounded-lg border-2 border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-800 mb-1">{template.title}</h4>
          <p className="text-sm text-gray-500 line-clamp-2 whitespace-pre-wrap">
            {template.content}
          </p>
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {template.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-500">
                {tag}
              </span>
            ))}
            {!template.isBuiltIn && (
              <span className="px-2 py-0.5 text-xs rounded bg-amber-100 text-amber-600">
                自定义
              </span>
            )}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleGo();
          }}
          className="shrink-0 flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-blue-500 text-white opacity-0 group-hover:opacity-100 hover:bg-blue-600 transition-all"
        >
          去填写 <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
