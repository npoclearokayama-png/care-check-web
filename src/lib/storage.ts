import type { Answers, AssessmentResult } from '../types/assessment';
import { STORAGE_VERSION } from './constants';

const ANSWERS_KEY = `carecheck.answers.${STORAGE_VERSION}`;
const RESULT_KEY = `carecheck.result.${STORAGE_VERSION}`;
const STEP_KEY = `carecheck.step.${STORAGE_VERSION}`;

export function saveAnswers(answers: Answers) {
  localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
}

export function loadAnswers(): Answers {
  const raw = localStorage.getItem(ANSWERS_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function saveResult(result: AssessmentResult) {
  localStorage.setItem(RESULT_KEY, JSON.stringify(result));
}

export function loadResult(): AssessmentResult | null {
  const raw = localStorage.getItem(RESULT_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveStep(step: number) {
  localStorage.setItem(STEP_KEY, String(step));
}

export function loadStep(): number {
  const raw = localStorage.getItem(STEP_KEY);
  return raw ? Number(raw) : 0;
}

export function clearSession() {
  localStorage.removeItem(ANSWERS_KEY);
  localStorage.removeItem(RESULT_KEY);
  localStorage.removeItem(STEP_KEY);
}
