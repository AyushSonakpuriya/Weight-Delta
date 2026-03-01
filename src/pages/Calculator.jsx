import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { calcBMR, calcTDEE, calcDailyTarget, calcMacros, clampTargetWeight } from '../lib/calorieCalc';
import { generateMotivationalQuote } from '../services/gemini';
import useCalorieWorker from '../hooks/useCalorieWorker';
import CalcInputs from '../components/CalcInputs';
import BodyViz from '../components/BodyViz';
import CalorieRing from '../components/CalorieRing';
import MacroChart from '../components/MacroChart';
import BlurText from '../components/BlurText';
import './Calculator.css';

const DEFAULT_STATE = {
    gender: 'male',
    age: 30,
    height: 175,
    currentWeight: 80,
    targetWeight: 75,
    duration: 8,
};

const SAVE_DEBOUNCE_MS = 2000;

// Sync fallback functions passed to the worker hook
const syncCalc = { calcBMR, calcTDEE, calcDailyTarget, calcMacros, clampTargetWeight };

function Calculator() {
    const [state, setState] = useState(DEFAULT_STATE);
    const saveTimerRef = useRef(null);
    const lastSavedRef = useRef(null);
    const insightTimerRef = useRef(null);
    const [aiInsight, setAiInsight] = useState('');
    const [insightLoading, setInsightLoading] = useState(true);

    // Offload all calorie math to a Web Worker (rAF-throttled)
    const computed = useCalorieWorker(state, syncCalc);

    // Derive safeTargetWeight from worker results
    const safeTargetWeight = computed.safeTargetWeight;

    // Debounced auto-save to Supabase
    const saveToSupabase = useCallback(async (currentState, currentComputed) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const payload = {
                user_id: session.user.id,
                age: currentState.age,
                height_cm: currentState.height,
                current_weight: currentState.currentWeight,
                desired_weight: currentComputed.safeTargetWeight,
                duration_weeks: currentState.duration,
                daily_calories: currentComputed.dailyTarget,
            };

            // Skip if payload hasn't changed
            const key = JSON.stringify(payload);
            if (key === lastSavedRef.current) return;

            await supabase.from('calculations').insert(payload);
            lastSavedRef.current = key;
        } catch (err) {
            console.error('Auto-save error:', err);
        }
    }, []);

    // Auto-save effect with debounce
    useEffect(() => {
        // Only save if values are reasonable (not mid-typing garbage)
        const cw = state.currentWeight;
        const age = state.age;
        const ht = state.height;
        if (cw < 30 || cw > 200 || age < 15 || age > 80 || ht < 100 || ht > 250) {
            return; // skip saving invalid intermediate states
        }

        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
            saveToSupabase(state, computed);
        }, SAVE_DEBOUNCE_MS);

        return () => {
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        };
    }, [state, computed, saveToSupabase]);

    // State for CalorieRing — pass safeTargetWeight instead of raw
    const displayState = useMemo(() => ({
        ...state,
        targetWeight: safeTargetWeight,
    }), [state, safeTargetWeight]);

    // Fetch a fresh motivational quote once per page visit (mount only)
    useEffect(() => {
        let cancelled = false;
        setInsightLoading(true);
        setAiInsight('');

        (async () => {
            try {
                const quote = await generateMotivationalQuote();
                if (!cancelled) setAiInsight(quote);
            } catch {
                if (!cancelled) setAiInsight('The distance between where you are and where you want to be is bridged by what you do next.');
            } finally {
                if (!cancelled) setInsightLoading(false);
            }
        })();

        return () => { cancelled = true; };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <section className="calc-page section">
            <div className="container">
                {/* Breadcrumb */}


                {/* Title */}
                <BlurText
                    text="Calorie Goal Calculator"
                    delay={200}
                    animateBy="words"
                    direction="top"
                    className="calc-page__title"
                />

                {/* Two-Column Layout */}
                <div className="calc-page__grid">
                    {/* LEFT COLUMN */}
                    <div className="calc-page__left">
                        <div className="calc-page__left-top">
                            <div style={{ '--stagger': 0 }}>
                                {/* Input Card */}
                                <CalcInputs state={state} onChange={setState} />
                            </div>

                            {/* Body Visualization */}
                            <div style={{ '--stagger': 1 }}>
                                <BodyViz
                                    currentWeight={state.currentWeight}
                                    targetWeight={safeTargetWeight}
                                    duration={state.duration}
                                    gender={state.gender}
                                    onDurationChange={(d) => setState(prev => ({ ...prev, duration: d }))}
                                />
                            </div>
                        </div>

                        {/* Motivational Footer */}
                        <div className="calc-page__motivation" style={{ '--stagger': 2 }}>
                            {insightLoading ? (
                                <div className="calc-page__insight-loading">
                                    <div className="calc-page__insight-shimmer" />
                                    <div className="calc-page__insight-shimmer calc-page__insight-shimmer--short" />
                                </div>
                            ) : (
                                <p className="calc-page__quote">
                                    {aiInsight || <em>Analyzing your data…</em>}
                                </p>
                            )}
                        </div>

                        {/* Height & Weight Reference */}
                        <div className="calc-page__reference" style={{ '--stagger': 3 }}>
                            <span className="calc-page__reference-title">General reference range</span>
                            <div className="calc-page__reference-images">
                                <a href="/Ideal height.webp" target="_blank" rel="noopener noreferrer">
                                    <img src="/Ideal height.webp" alt="Height conversion reference" className="calc-page__reference-img" width="280" height="200" loading="lazy" />
                                </a>
                                <a href="/Ideal weight.webp" target="_blank" rel="noopener noreferrer">
                                    <img src="/Ideal weight.webp" alt="Ideal height and weight reference" className="calc-page__reference-img" width="280" height="200" loading="lazy" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="calc-page__right">
                        <div style={{ '--stagger': 4 }}>
                            <CalorieRing dailyCalories={computed.dailyTarget} computed={computed} state={displayState} />
                        </div>
                        <div style={{ '--stagger': 5 }}>
                            <MacroChart macros={computed.macros} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Calculator;
