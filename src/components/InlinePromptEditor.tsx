import { useRef, useEffect, useCallback, useState, Fragment } from 'react';
import { parseToSegments, groupBySentences } from '../utils/placeholder';
import type { PromptTemplate } from '../types';

interface Props {
  template: PromptTemplate;
  values: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
}

export default function InlinePromptEditor({ template, values, onChange }: Props) {
  const [focusedPlaceholder, setFocusedPlaceholder] = useState<string | null>(null);
  const segments = parseToSegments(template.content);
  const sentenceGroups = groupBySentences(segments, values, focusedPlaceholder);

  const handleChange = (name: string, value: string) => {
    onChange({ ...values, [name]: value });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 leading-8 text-gray-700">
      <h3 className="font-medium text-gray-800 mb-3 text-base">{template.title}</h3>
      <div className="text-sm leading-8">
        {sentenceGroups.map((group, gi) => (
          <span key={`sg-${gi}`}>
            <span
              className={`transition-all duration-200 ${
                group.isActive ? 'text-gray-800' : 'text-gray-300'
              }`}
            >
              {group.segments.map((seg, si) => {
                if (seg.type === 'text') {
                  return <Fragment key={`seg-${gi}-${si}`}><span>{seg.value}</span></Fragment>;
                }
                return (
                  <InlineTextarea
                    key={`ph-${gi}-${si}`}
                    name={seg.value}
                    value={values[seg.value] || ''}
                    onChange={(v) => handleChange(seg.value, v)}
                    onFocus={() => setFocusedPlaceholder(seg.value)}
                    onBlur={() => setFocusedPlaceholder(null)}
                  />
                );
              })}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function InlineTextarea({
  name,
  value,
  onChange,
  onFocus,
  onBlur,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  onFocus: () => void;
  onBlur: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  const adjustSize = useCallback(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.max(24, el.scrollHeight) + 'px';
      if (measureRef.current) {
        const textWidth = measureRef.current.offsetWidth;
        el.style.width = Math.max(60, Math.min(300, textWidth + 20)) + 'px';
      }
    }
  }, [value]);

  useEffect(() => {
    adjustSize();
  }, [value, adjustSize]);

  return (
    <span className="relative inline-flex items-start mx-0.5 align-baseline">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          requestAnimationFrame(adjustSize);
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={name}
        rows={1}
        className="inline-block border-0 border-b-2 border-blue-300 bg-transparent outline-none focus:border-blue-500 focus:bg-blue-50/50 rounded-sm px-1 py-0 resize-none overflow-hidden placeholder-gray-350 align-baseline"
        style={{ minWidth: '60px', width: '80px', maxWidth: '300px', lineHeight: 'inherit' }}
      />
      <div
        ref={measureRef}
        className="absolute invisible whitespace-pre px-1"
        style={{ lineHeight: 'inherit', fontSize: 'inherit' }}
        aria-hidden="true"
      >
        {value || name}
      </div>
    </span>
  );
}
