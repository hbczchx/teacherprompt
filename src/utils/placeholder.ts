export function parsePlaceholders(content: string): string[] {
  const regex = /\{\{(.+?)\}\}/g;
  const names = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    names.add(match[1].trim());
  }
  return Array.from(names);
}

export function fillTemplate(
  content: string,
  values: Record<string, string>,
  defaults?: Record<string, string>
): string {
  return content.replace(/\{\{(.+?)\}\}/g, (_, key: string) => {
    const k = key.trim();
    if (values[k]?.trim()) return values[k];
    if (defaults?.[k]) return defaults[k];
    return getGenericDefault(k);
  });
}

const genericDefaults: Record<string, string> = {
  '年级': '相应年级',
  '学段': '相应学段',
  '学科': '相关学科',
  '学期': '本学期',
  '课时': '适当课时',
  '页数': '适量页数',
  '题量': '适量',
  '题目数量': '适量',
  '字数': '约800字',
  '满分': '100分',
  '用时': '适当时间',
  '考试时间': '90分钟',
  '考试类型': '期末考试',
  '活动时长': '40分钟',
  '参与人数': '全班学生',
  '评价基调': '积极正面',
  '语气': '亲切专业',
  '语气风格': '亲切鼓励',
  '评语风格': '正面引导',
  '风格': '简洁明了',
  '活动形式': '小组合作',
  '参与方式': '小组讨论',
  '基础比例': '60',
  '中等比例': '30',
  '拓展比例': '10',
  '难度比例': '7:2:1',
  'a层时间': '15',
  'b层时间': '20',
  'c层时间': '15',
  '表扬点数': '3',
  '改进点数': '2',
  '拓展题数': '2',
  '变式题数': '3',
  '亮点数量': '2',
  '周期': '本周',
  '授课类型': '新授课',
  '导入素材': '相关图片与短视频',
  '核心页数': '3',
  '互动形式': '课堂提问与小组讨论',
  '检测题数': '3',
  '教学方法': '讲授法与合作探究相结合',
  '教学重点': '根据教学实际确定',
  '教学难点': '根据教学实际确定',
  '课题': '本课内容',
  '课题名称': '相关研究课题',
  '活动目标': '激发学生兴趣，培养核心素养',
  '准备材料': '常规教具与多媒体设备',
  '知识点': '本单元核心知识点',
  '题型': '选择题与解答题',
  '题型分布': '选择题40%，填空题20%，解答题40%',
  '考查范围': '本学期所学内容',
  '评价维度': '内容、结构、语言',
  '活动地点': '教室',
  '研究周期': '一学期',
  '研究方法': '行动研究法',
  '研究领域': '教育教学',
  '作文题目': '指定题目',
  '作文内容': '学生作文原文',
  '作业内容': '学生提交的作业',
  '完成情况': '基本完成',
  '原题内容': '原题文本',
  '错误答案': '学生的错误解答',
  '错误类型': '概念理解偏差',
  '学生姓名': '某同学',
  '性格特点': '活泼开朗',
  '表现亮点': '课堂参与积极',
  '改进之处': '作业完成质量有待提高',
  '职务特长': '担任小组长',
  '会议类型': '家长会',
  '会议主题': '学生成长与学业发展',
  '关注重点': '学习习惯与成绩提升',
  '重点事项': '近期教学安排与学生表现',
  '活动类型': '主题班会',
  '活动主题': '团结友爱，共同进步',
  '授课时间': '近日',
  '授课教师': '授课教师',
  '课型': '新授课',
  '亮点': '课堂互动充分，学生参与度高',
  '不足': '时间分配可进一步优化',
  '亮点方面': '教学设计与课堂组织',
  '商榷方面': '练习环节的梯度设计',
  '通知事项': '学校统一安排事项',
  '具体要求': '请按时完成',
  '截止时间': '本周五前',
  '其他说明': '如有疑问请私信联系',
  '沟通事项': '学生近期学习情况',
  '具体表现': '课堂注意力不够集中',
  '期望配合': '在家中督促孩子完成作业',
  '关键词': '进步、团结、勤奋',
  '活动回顾': '本周班会与课间操比赛',
  '关注事项': '课后作业完成质量',
};

function getGenericDefault(key: string): string {
  if (genericDefaults[key]) return genericDefaults[key];
  // 通用兜底
  if (key.includes('时间') || key.includes('时长')) return '适当时间';
  if (key.includes('字数')) return '约800字';
  if (key.includes('数量') || key.includes('题数') || key.includes('点数')) return '适量';
  if (key.includes('风格') || key.includes('语气')) return '专业友好';
  if (key.includes('比例')) return '适当比例';
  if (key.includes('目标') || key.includes('重点') || key.includes('难点')) return '根据教学实际确定';
  return `【${key}】`;
}

export interface Segment {
  type: 'text' | 'placeholder';
  value: string;
}

export function parseToSegments(content: string): Segment[] {
  const regex = /\{\{(.+?)\}\}/g;
  const segments: Segment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: content.slice(lastIndex, match.index) });
    }
    segments.push({ type: 'placeholder', value: match[1].trim() });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < content.length) {
    segments.push({ type: 'text', value: content.slice(lastIndex) });
  }
  return segments;
}

interface SentenceGroup {
  segments: Segment[];
  placeholders: string[];
  isActive: boolean;
}

export function groupBySentences(
  segments: Segment[],
  filledValues: Record<string, string>,
  focusedPlaceholder?: string | null
): SentenceGroup[] {
  const groups: SentenceGroup[] = [];
  let current: Segment[] = [];
  let currentPHs: string[] = [];

  const sentenceEnd = /[。！？\n]/;

  for (const seg of segments) {
    current.push(seg);
    if (seg.type === 'placeholder') {
      currentPHs.push(seg.value);
    }
    if (seg.type === 'text' && sentenceEnd.test(seg.value)) {
      groups.push({
        segments: current,
        placeholders: [...currentPHs],
        isActive:
          currentPHs.length === 0 ||
          currentPHs.every((ph) => filledValues[ph]?.trim()) ||
          currentPHs.some((ph) => ph === focusedPlaceholder),
      });
      current = [];
      currentPHs = [];
    }
  }

  if (current.length > 0) {
    groups.push({
      segments: current,
      placeholders: [...currentPHs],
      isActive:
        currentPHs.length === 0 ||
        currentPHs.every((ph) => filledValues[ph]?.trim()) ||
        currentPHs.some((ph) => ph === focusedPlaceholder),
    });
  }

  return groups;
}

/** 检测并重名占位符，自动追加数字后缀避免共享值 */
export function deduplicatePlaceholders(content: string): { content: string; renamed: string[] } {
  const regex = /\{\{(.+?)\}\}/g;
  const names = new Map<string, number>();
  const renamed: string[] = [];

  const deduped = content.replace(regex, (match, name: string) => {
    const key = name.trim();
    const count = names.get(key) ?? 0;
    if (count === 0) {
      // 第一次出现，不改名
      names.set(key, 1);
      return match;
    }
    // 重名，追加编号
    const newName = `${key}${count + 1}`;
    names.set(key, count + 1);
    renamed.push(`${key} → ${newName}`);
    return `{{${newName}}}`;
  });

  return { content: deduped, renamed };
}
