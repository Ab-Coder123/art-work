import { test, expect } from '@playwright/test';
import { soundFX } from '../../src/utils/soundFX';

test.describe('Unit: SoundFXEngine & Audio Utility', () => {
  test('should provide an active singleton instance', () => {
    expect(soundFX).toBeDefined();
    expect(typeof soundFX.isMuted).toBe('function');
    expect(typeof soundFX.toggleMute).toBe('function');
    expect(typeof soundFX.subscribe).toBe('function');
  });

  test('should allow subscribing and unsubscribing listeners', () => {
    let callCount = 0;
    const unsubscribe = soundFX.subscribe(() => {
      callCount += 1;
    });

    soundFX.toggleMute();
    expect(callCount).toBe(1);

    unsubscribe();
    soundFX.toggleMute();
    expect(callCount).toBe(1); // Listener was cleanly removed
  });

  test('should handle sound triggers gracefully without throwing in any environment', () => {
    expect(() => {
      soundFX.playPop();
      soundFX.playClick();
      soundFX.playTape();
      soundFX.playWhoosh();
    }).not.toThrow();
  });
});
