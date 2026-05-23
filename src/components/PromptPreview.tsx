import { useRef, useEffect, useCallback } from 'react';

interface Props {
  content: string;
  onChange?: (content: string) => void;
}

export default function PromptPreview({ content, onChange }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.max(120, el.scrollHeight) + 'px';
    }
  }, [content]);

  useEffect(() => {
    adjustHeight();
  }, [content, adjustHeight]);

  return (
    <textarea
      ref={textareaRef}
      value={content}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 leading-relaxed font-sans resize-none outline-none focus:border-blue-300 focus:bg-white transition-colors"
      style={{ minHeight: '120px' }}
    />
  );
}
