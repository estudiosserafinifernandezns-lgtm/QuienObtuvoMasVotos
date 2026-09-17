import type { President } from '@/types';

export function shufflePresidents(pool: President[]): President[] {
  const arr = [...pool];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function checkAnswer(
  left: President,
  right: President,
  answer: 'more' | 'less'
): boolean {
  if (answer === 'more') {
    return right.votes > left.votes;
  } else {
    return right.votes < left.votes;
  }
}

export function formatVotes(votes: number): string {
  return votes.toLocaleString('es-PY');
}

export function voteDifference(a: number, b: number): number {
  return Math.abs(a - b);
}

export function getHigherPresident(
  left: President,
  right: President
): President {
  return left.votes > right.votes ? left : right;
}
