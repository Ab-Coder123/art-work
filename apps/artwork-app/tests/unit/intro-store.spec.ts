import { test, expect } from '@playwright/test';
import { useIntroStore } from '../../src/hooks/useIntroStore';

test.describe('Unit: useIntroStore (Zustand State Store)', () => {
  test.beforeEach(() => {
    useIntroStore.getState().resetIntro();
  });

  test('should have initial active state for first-time visitors', () => {
    const state = useIntroStore.getState();
    expect(state.hasPlayedIntro).toBe(false);
    expect(state.isIntroActive).toBe(true);
  });

  test('should transition to completed state on completeIntro()', () => {
    useIntroStore.getState().completeIntro();
    const state = useIntroStore.getState();
    expect(state.hasPlayedIntro).toBe(true);
    expect(state.isIntroActive).toBe(false);
  });

  test('should support resetting intro state for replay functionality', () => {
    useIntroStore.getState().completeIntro();
    expect(useIntroStore.getState().isIntroActive).toBe(false);

    useIntroStore.getState().resetIntro();
    const state = useIntroStore.getState();
    expect(state.hasPlayedIntro).toBe(false);
    expect(state.isIntroActive).toBe(true);
  });
});
