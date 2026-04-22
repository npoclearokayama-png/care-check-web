export type ScaleKey =
  | 'child_load'
  | 'parent_fatigue'
  | 'isolation_support'
  | 'future_uncertainty';

export type Question = {
  id: string;
  order: number;
  scale: ScaleKey;
  text: string;
  reverse: boolean;
  required: boolean;
};

export type AnswerValue = 0 | 1 | 2 | 3 | 4;

export type Answers = Record<string, AnswerValue | undefined>;

export type ScaleScore = {
  raw: number;
  normalized: number;
};

export type AssessmentResult = {
  totalRaw: number;
  totalNormalized: number;
  scales: Record<ScaleKey, ScaleScore>;
  topScales: ScaleKey[];
  band: 'low' | 'mild' | 'high' | 'very_high';
  summaryTitle: string;
  summaryMessage: string;
  scaleMessages: Record<ScaleKey, string>;
  tips: string[];
};

export type ResourceLink = {
  title: string;
  description: string;
  url: string;
  external?: boolean;
};
