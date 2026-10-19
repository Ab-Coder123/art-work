import { test, expect } from '@playwright/test';
import { useScrollytellingStore, SCENE_STEPS, SceneId } from '../../src/hooks/useScrollytellingStore';

test.describe('Unit: useScrollytellingStore & SCENE_STEPS', () => {
  test.beforeEach(() => {
    useScrollytellingStore.getState().setCurrentScene('hero');
    useScrollytellingStore.getState().setScrollProgress(0);
  });

  test('should verify correct configuration of all 4 scrollytelling scenes', () => {
    expect(SCENE_STEPS).toHaveLength(4);
    expect(SCENE_STEPS.map((s) => s.id)).toEqual(['hero', 'why-us', 'capabilities', 'contact']);
    expect(SCENE_STEPS.map((s) => s.stepNumber)).toEqual(['01', '02', '03', '04']);
  });

  test('should have initial scene set to hero and progress at 0', () => {
    const state = useScrollytellingStore.getState();
    expect(state.currentScene).toBe('hero');
    expect(state.scrollProgress).toBe(0);
  });

  test('should update current scene and reflect across state', () => {
    const targetScene: SceneId = 'capabilities';
    useScrollytellingStore.getState().setCurrentScene(targetScene);
    expect(useScrollytellingStore.getState().currentScene).toBe('capabilities');
  });

  test('should clamp or track progress accurately from 0.0 to 1.0', () => {
    useScrollytellingStore.getState().setScrollProgress(0.45);
    expect(useScrollytellingStore.getState().scrollProgress).toBe(0.45);

    useScrollytellingStore.getState().setScrollProgress(1.0);
    expect(useScrollytellingStore.getState().scrollProgress).toBe(1.0);
  });
});
