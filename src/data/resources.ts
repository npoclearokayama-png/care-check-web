import type { ResourceLink } from '../types/assessment';

export const resources: ResourceLink[] = [
  {
    title: 'ChatGPT に結果を貼って相談する',
    description:
      '結果画面の要約をコピーして、負担が高い場面の整理、相談文の下書き、次の一歩の整理に使えます。',
    url: 'https://openai.com/chatgpt/',
    external: true,
  },
  {
    title: 'Gemini に結果を貼って相談する',
    description:
      '結果をもとに、生活上の困りごとの整理、支援機関に伝える文章のたたき台づくりに使えます。',
    url: 'https://gemini.google.com/',
    external: true,
  },
];
