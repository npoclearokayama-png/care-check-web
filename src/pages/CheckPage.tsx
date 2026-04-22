import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import QuestionCard from '../components/QuestionCard';
import ResumeDialog from '../components/ResumeDialog';
import { questions } from '../data/questions';
import { scoreAssessment } from '../lib/scoring';
import {
  clearSession,
  loadAnswers,
  loadStep,
  saveAnswers,
  saveResult,
  saveStep,
} from '../lib/storage';
import type { AnswerValue, Answers } from '../types/assessment';

export default function CheckPage() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [showResume, setShowResume] = useState(false);

  useEffect(() => {
    const storedAnswers = loadAnswers();
    const storedStep = loadStep();
    const hasProgress = Object.keys(storedAnswers).length > 0 || storedStep > 0;
    if (hasProgress) {
      setShowResume(true);
      setAnswers(storedAnswers);
      setStep(storedStep);
    }
  }, []);

  const currentQuestion = useMemo(() => questions[step], [step]);
  const currentValue = currentQuestion ? answers[currentQuestion.id] : undefined;

  function handleResume() {
    setShowResume(false);
  }

  function handleReset() {
    clearSession();
    setAnswers({});
    setStep(0);
    setShowResume(false);
  }

  function handleSelect(value: AnswerValue) {
    if (!currentQuestion) return;
    const nextAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(nextAnswers);
    saveAnswers(nextAnswers);
  }

  function handleNext() {
    if (!currentQuestion) return;
    if (answers[currentQuestion.id] === undefined) return;

    if (step === questions.length - 1) {
      const result = scoreAssessment(answers);
      saveResult(result);
      saveStep(step);
      navigate('/result');
      return;
    }

    const nextStep = step + 1;
    setStep(nextStep);
    saveStep(nextStep);
  }

  function handleBack() {
    const nextStep = Math.max(step - 1, 0);
    setStep(nextStep);
    saveStep(nextStep);
  }

  useEffect(() => {
    if (currentValue === undefined) return;
    const timer = window.setTimeout(() => {
      handleNext();
    }, 220);
    return () => window.clearTimeout(timer);
  }, [currentValue]);

  if (!currentQuestion) {
    return null;
  }

  return (
    <section className="stack">
      <ResumeDialog open={showResume} onResume={handleResume} onReset={handleReset} />
      <ProgressBar current={step + 1} total={questions.length} />
      <QuestionCard question={currentQuestion} value={currentValue} onSelect={handleSelect} />

      <div className="button-row">
        <button type="button" className="secondary-button" onClick={handleBack} disabled={step === 0}>
          戻る
        </button>
        <button
          type="button"
          className="primary-button"
          onClick={handleNext}
          disabled={currentValue === undefined}
        >
          {step === questions.length - 1 ? '結果を見る' : '次へ'}
        </button>
      </div>
    </section>
  );
}
