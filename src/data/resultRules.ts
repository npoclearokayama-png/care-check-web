import type { ScaleKey } from '../types/assessment';

export const totalBandRules = [
  {
    min: 0,
    max: 24,
    band: 'low',
    title: '今の負担感は比較的低めです',
    message:
      'いまは何とか回せている部分もありそうです。ただし、育児の負担は波があるため、しんどさが強まる前に休み方や頼り先を確認しておくと役立ちます。',
  },
  {
    min: 25,
    max: 49,
    band: 'mild',
    title: '負担感がたまり始めているかもしれません',
    message:
      '大きく崩れてはいなくても、気づかないうちに余裕が削られている可能性があります。しんどい時間帯やきっかけを整理すると、対処しやすくなります。',
  },
  {
    min: 50,
    max: 74,
    band: 'high',
    title: '負担感が高めの状態かもしれません',
    message:
      'いまは複数の負担が重なっている可能性があります。あなたの努力が足りないのではなく、抱える量が多いのかもしれません。一人で抱えず、支援や相談先を視野に入れてください。',
  },
  {
    min: 75,
    max: 100,
    band: 'very_high',
    title: 'かなり強い負担感がある可能性があります',
    message:
      'いまはかなりしんどい状態に近いかもしれません。頑張り方の問題として抱え込まず、生活を保つために誰かとつながることを優先してください。',
  },
] as const;

export const scaleDescriptions: Record<ScaleKey, string> = {
  child_load:
    '子どもへの対応そのものに強い負荷がかかっている可能性があります。対応の工夫だけでなく、生活全体の組み立てや支援の入り方を見直すことが有効な場合があります。',
  parent_fatigue:
    '親自身の心身の消耗が大きくなっている可能性があります。休息だけでなく、負担の量そのものを減らす視点が必要かもしれません。',
  isolation_support:
    '孤立感や支援不足が負担を押し上げている可能性があります。困りごとの内容以上に、誰とつながるかを整えることが重要になりそうです。',
  future_uncertainty:
    '見通しの持ちにくさや不安の強さが、日々の負担を大きくしている可能性があります。先の全部ではなく、まず次の一歩だけを具体化するのが有効です。',
};

export const defaultTips = [
  '週の中で一番しんどい時間帯を1つ書き出す',
  '話せる相手を1人だけ決める',
  '支援先に「困りごと」ではなく「生活が回らない点」を伝える',
];

export const scaleLabels: Record<ScaleKey, string> = {
  child_load: '子ども対応の負荷',
  parent_fatigue: '親自身の消耗',
  isolation_support: '孤立・支援不足',
  future_uncertainty: '見通しの持ちにくさ',
};
