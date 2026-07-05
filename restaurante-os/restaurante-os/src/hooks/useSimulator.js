import { useState, useEffect, useRef, useCallback } from 'react';
import { tick, createState, changeCores, changeAlgo, reset, spawnOne, toggleThreads } from '../engine/simulator';

export function useSimulator(speedMs) {
  const [state, setState] = useState(createState);
  const ref = useRef(null);

  useEffect(() => {
    clearInterval(ref.current);
    ref.current = setInterval(() => setState(s => s.running ? tick(s) : s), speedMs);
    return () => clearInterval(ref.current);
  }, [speedMs]);

  return {
    state,
    play:          useCallback(() => setState(s => ({ ...s, running: true })), []),
    pause:         useCallback(() => setState(s => ({ ...s, running: false })), []),
    restart:       useCallback(() => setState(reset()), []),
    setCores:      useCallback((n) => setState(s => changeCores(s, n)), []),
    setAlgo:       useCallback((a) => setState(s => changeAlgo(s, a)), []),
    addOrder:      useCallback((type) => setState(s => spawnOne(s, type)), []),
    toggleThreads: useCallback((pid) => setState(s => toggleThreads(s, pid)), []),
  };
}
