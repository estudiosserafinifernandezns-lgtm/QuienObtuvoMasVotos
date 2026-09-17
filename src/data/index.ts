import type { President, GameMode } from '@/types';
import { paraguayPresidents } from '@/data/presidentsParaguay';

export function getPresidentsForMode(mode: GameMode): President[] {
  switch (mode) {
    case 'paraguay':
      return paraguayPresidents;
    case 'argentina':
      return [];
    case 'global':
      return [];
  }
}

export function getAvailableModes(): GameMode[] {
  const modes: GameMode[] = ['paraguay'];
  if (getPresidentsForMode('argentina').length > 0) modes.push('argentina');
  if (getPresidentsForMode('global').length > 0) modes.push('global');
  return modes;
}

export function isModeAvailable(mode: GameMode): boolean {
  return getPresidentsForMode(mode).length >= 2;
}
