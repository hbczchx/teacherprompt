type AdSize = 'banner' | 'card' | 'inline';

interface Props {
  size?: AdSize;
  className?: string;
}

const sizeClass: Record<AdSize, string> = {
  banner: 'h-20 md:h-24',
  card: 'h-48 md:h-64',
  inline: 'h-16',
};

const sizeLabel: Record<AdSize, string> = {
  banner: '横幅广告位 728×90',
  card: '信息流广告位 300×250',
  inline: '内嵌广告位',
};

export default function AdPlaceholder({ size = 'card', className = '' }: Props) {
  return (
    <div
      className={`w-full ${sizeClass[size]} border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center bg-gray-50/50 hover:bg-gray-100/50 transition-colors cursor-pointer group ${className}`}
      title="点击配置广告"
    >
      <div className="text-center">
        <span className="text-xs text-gray-300 group-hover:text-gray-400 transition-colors">
          {sizeLabel[size]}
        </span>
      </div>
    </div>
  );
}
