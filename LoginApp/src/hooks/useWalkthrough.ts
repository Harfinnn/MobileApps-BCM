import { useState, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type TargetRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};
export type WalkthroughStep = {
  key: string;
  ref: React.RefObject<any>;
  text: string;
};

export function useWalkthrough(
  steps: WalkthroughStep[],
  storageKey: string,
  testingMode = false,
) {
  const [visible, setVisible] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [target, setTarget] = useState<TargetRect | null>(null);

  const measureCurrent = useCallback(() => {
    const step = steps[stepIndex];
    if (!step?.ref?.current) {
      setTarget(null);
      return;
    }
    step.ref.current.measureInWindow(
      (x: number, y: number, width: number, height: number) => {
        setTarget({ x, y, width, height });
      },
    );
  }, [steps, stepIndex]);

  const clearTarget = useCallback(() => setTarget(null), []);

  const start = useCallback(async () => {
    if (!testingMode) {
      const seen = await AsyncStorage.getItem(storageKey);
      if (seen) return;
    }
    setStepIndex(0);
    setVisible(true);
    if (!testingMode) {
      await AsyncStorage.setItem(storageKey, 'true');
    }
  }, [storageKey, testingMode]);

  const next = useCallback(() => {
    setStepIndex(i => {
      if (i + 1 >= steps.length) {
        setVisible(false);
        return i;
      }
      return i + 1;
    });
  }, [steps.length]);

  const prev = useCallback(() => setStepIndex(i => Math.max(0, i - 1)), []);
  const stop = useCallback(() => setVisible(false), []);

  return {
    visible,
    target,
    currentStep: steps[stepIndex],
    stepIndex,
    isFirst: stepIndex === 0,
    isLast: stepIndex === steps.length - 1,
    start,
    next,
    prev,
    stop,
    remeasure: measureCurrent,
    clearTarget,
  };
}
