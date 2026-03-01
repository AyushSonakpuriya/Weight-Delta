import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * useCalorieWorker — offloads BMR/TDEE/Macro calculations to a Web Worker.
 *
 * Uses requestAnimationFrame to throttle computation requests during
 * rapid slider movements, and falls back to synchronous computation
 * if Web Workers are unavailable.
 *
 * @param {Object} state - { gender, currentWeight, height, age, targetWeight, duration }
 * @param {Object} syncCalc - fallback sync functions { calcBMR, calcTDEE, calcDailyTarget, calcMacros, clampTargetWeight }
 * @returns {Object} computed - { bmr, tdee, dailyTarget, dailyAdjustment, macros, isDeficit, safeTargetWeight }
 */
export default function useCalorieWorker(state, syncCalc) {
    const workerRef = useRef(null);
    const rafRef = useRef(null);
    const pendingRef = useRef(null);

    const [computed, setComputed] = useState(() => {
        // Initial synchronous computation
        const { gender, currentWeight, height, age, targetWeight, duration } = state;
        const safeTargetWeight = syncCalc.clampTargetWeight(currentWeight, targetWeight, duration);
        const bmr = syncCalc.calcBMR(gender, currentWeight, height, age);
        const tdee = syncCalc.calcTDEE(bmr);
        const { dailyTarget, dailyAdjustment } = syncCalc.calcDailyTarget(
            tdee, currentWeight, safeTargetWeight, duration, gender
        );
        const macros = syncCalc.calcMacros(dailyTarget);
        return {
            bmr: Math.round(bmr),
            tdee: Math.round(tdee),
            dailyTarget,
            dailyAdjustment,
            macros,
            isDeficit: safeTargetWeight < currentWeight,
            safeTargetWeight,
        };
    });

    // Initialize worker
    useEffect(() => {
        try {
            workerRef.current = new Worker(
                new URL('../workers/calorieWorker.js', import.meta.url),
                { type: 'module' }
            );
            workerRef.current.onmessage = (e) => {
                if (e.data.type === 'RESULT') {
                    setComputed(e.data.payload);
                }
            };
            workerRef.current.onerror = () => {
                // If worker fails, fallback to sync is handled in the rAF loop
                workerRef.current = null;
            };
        } catch {
            // Web Worker not supported — fallback mode
            workerRef.current = null;
        }

        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
                workerRef.current = null;
            }
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, []);

    // rAF-throttled computation dispatch
    const scheduleCompute = useCallback((newState) => {
        pendingRef.current = newState;

        if (rafRef.current) return; // already scheduled

        rafRef.current = requestAnimationFrame(() => {
            rafRef.current = null;
            const s = pendingRef.current;
            if (!s) return;
            pendingRef.current = null;

            if (workerRef.current) {
                // Offload to worker
                workerRef.current.postMessage({
                    type: 'COMPUTE',
                    payload: {
                        gender: s.gender,
                        currentWeight: s.currentWeight,
                        height: s.height,
                        age: s.age,
                        targetWeight: s.targetWeight,
                        duration: s.duration,
                    },
                });
            } else {
                // Sync fallback
                const safeTargetWeight = syncCalc.clampTargetWeight(s.currentWeight, s.targetWeight, s.duration);
                const bmr = syncCalc.calcBMR(s.gender, s.currentWeight, s.height, s.age);
                const tdee = syncCalc.calcTDEE(bmr);
                const { dailyTarget, dailyAdjustment } = syncCalc.calcDailyTarget(
                    tdee, s.currentWeight, safeTargetWeight, s.duration, s.gender
                );
                const macros = syncCalc.calcMacros(dailyTarget);
                setComputed({
                    bmr: Math.round(bmr),
                    tdee: Math.round(tdee),
                    dailyTarget,
                    dailyAdjustment,
                    macros,
                    isDeficit: safeTargetWeight < s.currentWeight,
                    safeTargetWeight,
                });
            }
        });
    }, [syncCalc]);

    // Trigger computation whenever state changes
    useEffect(() => {
        scheduleCompute(state);
    }, [state, scheduleCompute]);

    return computed;
}
