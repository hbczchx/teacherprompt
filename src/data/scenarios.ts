import type { Scenario } from '../types';

export const scenarios: Scenario[] = [
  {
    id: 'lesson-prep',
    name: '备课',
    icon: '📖',
    description: '教案设计、课件大纲、课堂活动方案',
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
  },
  {
    id: 'question-design',
    name: '出题',
    icon: '📝',
    description: '随堂练习、考试试卷、作业设计',
    color: 'bg-green-50 border-green-200 hover:bg-green-100',
  },
  {
    id: 'grading',
    name: '批改',
    icon: '✅',
    description: '作文批改、作业评价、错题分析',
    color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
  },
  {
    id: 'class-management',
    name: '班级管理',
    icon: '🏫',
    description: '家长会发言、学生评语、班级活动',
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
  },
  {
    id: 'research',
    name: '教研',
    icon: '🔬',
    description: '教学反思、听评课记录、课题研究',
    color: 'bg-pink-50 border-pink-200 hover:bg-pink-100',
  },
  {
    id: 'parent-communication',
    name: '家校沟通',
    icon: '💬',
    description: '通知文案、个别沟通、周报总结',
    color: 'bg-teal-50 border-teal-200 hover:bg-teal-100',
  },
];
