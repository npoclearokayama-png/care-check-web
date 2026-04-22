import type { Question, AnswerValue } from '../types/assessment';
import LikertScale from './LikertScale';

type Props = {
  question: Question;
  value?: AnswerValue;
  onSelect: (value: AnswerValue) => void;
};

export default function QuestionCard({ question, value, onSelect }: Props) {
  return (
    <section className="card question-card">
      <p className="eyebrow">設問 {question.order}</p>
      <h2>{question.text}</h2>
      <LikertScale value={value} onSelect={onSelect} />
    </section>
  );
}
