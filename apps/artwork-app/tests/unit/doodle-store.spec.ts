import { test, expect } from '@playwright/test';
import { useDoodleStore } from '../../src/store/useDoodleStore';

test.describe('Unit: useDoodleStore (Studio Pen Mode)', () => {
  test.beforeEach(() => {
    useDoodleStore.getState().setDoodleActive(false);
  });

  test('should default to doodle canvas inactive', () => {
    expect(useDoodleStore.getState().isDoodleActive).toBe(false);
  });

  test('should toggle doodle active state and return the new state value', () => {
    const firstToggle = useDoodleStore.getState().toggleDoodle();
    expect(firstToggle).toBe(true);
    expect(useDoodleStore.getState().isDoodleActive).toBe(true);

    const secondToggle = useDoodleStore.getState().toggleDoodle();
    expect(secondToggle).toBe(false);
    expect(useDoodleStore.getState().isDoodleActive).toBe(false);
  });

  test('should set doodle active explicitly', () => {
    useDoodleStore.getState().setDoodleActive(true);
    expect(useDoodleStore.getState().isDoodleActive).toBe(true);

    useDoodleStore.getState().setDoodleActive(false);
    expect(useDoodleStore.getState().isDoodleActive).toBe(false);
  });
});
