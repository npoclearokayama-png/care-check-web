import { scaleLabels } from '../data/resultRules';
import type { AssessmentResult } from '../types/assessment';

export function buildAiConsultationText(result: AssessmentResult): string {
  const lines = [
    '以下は「いまの育児負担セルフチェック」の結果です。診断ではなくセルフチェック結果として扱ってください。',
    '',
    `総合点: ${result.totalNormalized}/100`,
    `総合所見: ${result.summaryTitle}`,
    `総合メッセージ: ${result.summaryMessage}`,
    '',
    '領域別結果:',
    `- ${scaleLabels.child_load}: ${result.scales.child_load.normalized}/100`,
    `- ${scaleLabels.parent_fatigue}: ${result.scales.parent_fatigue.normalized}/100`,
    `- ${scaleLabels.isolation_support}: ${result.scales.isolation_support.normalized}/100`,
    `- ${scaleLabels.future_uncertainty}: ${result.scales.future_uncertainty.normalized}/100`,
    '',
    '高い領域:',
    ...result.topScales.map((scale) => `- ${scaleLabels[scale]}: ${result.scaleMessages[scale]}`),
    '',
    'この結果を踏まえて、次の3点を日本語で整理してください。',
    '1. 今の生活で優先して整えた方がよい点',
    '2. 家族・支援者・相談先に伝えるとよい内容',
    '3. 今日からできる小さな一歩',
  ];

  return lines.join('\n');
}

export function printResult() {
  window.print();
}
