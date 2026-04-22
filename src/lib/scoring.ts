import { questions } from '../data/questions';
import { totalBandRules, scaleDescriptions, defaultTips } from '../data/resultRules';
import type { Answers, AssessmentResult, ScaleKey } from '../types/assessment';

const scaleKeys: ScaleKey[] = [
  'child_load',
  'parent_fatigue',
  'isolation_support',
  'future_uncertainty',
];

function normalize(value: number, max: number): number {
  return Math.round((value / max) * 100);
}

function getBand(totalNormalized: number) {
  return totalBandRules.find(
    (rule) => totalNormalized >= rule.min && totalNormalized <= rule.max
  )!;
}

export function scoreAssessment(answers: Answers): AssessmentResult {
  const rawScaleTotals: Record<ScaleKey, number> = {
    child_load: 0,
    parent_fatigue: 0,
    isolation_support: 0,
    future_uncertainty: 0,
  };

  for (const q of questions) {
    const value = answers[q.id];
    if (value === undefined) {
      throw new Error(`未回答の設問があります: ${q.id}`);
    }
    const scored = q.reverse ? 4 - value : value;
    rawScaleTotals[q.scale] += scored;
  }

  const scales = {
    child_load: {
      raw: rawScaleTotals.child_load,
      normalized: normalize(rawScaleTotals.child_load, 24),
    },
    parent_fatigue: {
      raw: rawScaleTotals.parent_fatigue,
      normalized: normalize(rawScaleTotals.parent_fatigue, 24),
    },
    isolation_support: {
      raw: rawScaleTotals.isolation_support,
      normalized: normalize(rawScaleTotals.isolation_support, 24),
    },
    future_uncertainty: {
      raw: rawScaleTotals.future_uncertainty,
      normalized: normalize(rawScaleTotals.future_uncertainty, 24),
    },
  };

  const totalRaw =
    rawScaleTotals.child_load +
    rawScaleTotals.parent_fatigue +
    rawScaleTotals.isolation_support +
    rawScaleTotals.future_uncertainty;

  const totalNormalized = normalize(totalRaw, 96);
  const bandRule = getBand(totalNormalized);

  const topScales = [...scaleKeys]
    .sort((a, b) => scales[b].normalized - scales[a].normalized)
    .slice(0, 2);

  const scaleMessages = {
    child_load: scaleDescriptions.child_load,
    parent_fatigue: scaleDescriptions.parent_fatigue,
    isolation_support: scaleDescriptions.isolation_support,
    future_uncertainty: scaleDescriptions.future_uncertainty,
  };

  return {
    totalRaw,
    totalNormalized,
    scales,
    topScales,
    band: bandRule.band,
    summaryTitle: bandRule.title,
    summaryMessage: bandRule.message,
    scaleMessages,
    tips: defaultTips,
  };
}
