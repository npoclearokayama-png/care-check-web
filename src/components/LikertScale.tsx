import { likertOptions } from '../lib/constants';
import type { AnswerValue } from '../types/assessment';

type Props = {
  value?: AnswerValue;
  onSelect: (value: AnswerValue) => void;
};

export default function LikertScale({ value, onSelect }: Props) {
  return (
    <div className="likert-grid" role="radiogroup" aria-label="回答を選択">
      {likertOptions.map((option) => {
        const selected = value === option.value;
        return (
          <button
            type="button"
            key={option.value}
            className={`likert-button ${selected ? 'selected' : ''}`}
            aria-pressed={selected}
            onClick={() => onSelect(option.value)}
          >
            <span className="likert-value">{option.value}</span>
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
