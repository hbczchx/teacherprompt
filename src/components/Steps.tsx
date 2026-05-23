const steps = ['选择场景', '选择模板', '填写信息', '生成结果'];

interface Props {
  current: number;
}

export default function Steps({ current }: Props) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
              i <= current
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            {i + 1}
          </div>
          <span
            className={`text-sm ${
              i <= current ? 'text-gray-700 font-medium' : 'text-gray-400'
            }`}
          >
            {label}
          </span>
          {i < steps.length - 1 && (
            <div className={`w-8 h-0.5 ${i < current ? 'bg-blue-300' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}
