import type { PromptTemplate } from '../types';

interface Props {
  template: PromptTemplate;
  selected: boolean;
  onToggle: () => void;
}

export default function TemplateCard({ template, selected, onToggle }: Props) {
  return (
    <div
      onClick={onToggle}
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
        selected
          ? 'border-blue-400 bg-blue-50 shadow-sm'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          className="mt-1 w-4 h-4 accent-blue-500 shrink-0"
          onClick={(e) => e.stopPropagation()}
        />
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
      </div>
    </div>
  );
}
