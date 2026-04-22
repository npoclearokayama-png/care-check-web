import type { AnswerValue } from '../types/assessment';

export const STORAGE_VERSION = 'v1';

export const likertOptions: { value: AnswerValue; label: string }[] = [
  { value: 0, label: 'まったくあてはまらない' },
  { value: 1, label: 'あまりあてはまらない' },
  { value: 2, label: 'どちらともいえない' },
  { value: 3, label: 'ややあてはまる' },
  { value: 4, label: 'とてもあてはまる' },
];
