import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { calcBMR, calcTDEE, calcDailyTarget, calcMacros, clampTargetWeight } from '../lib/calorieCalc';
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

function Calculator() {
    const [state, setState] = useState(DEFAULT_STATE);
    const saveTimerRef = useRef(null);
    const lastSavedRef = useRef(null);

    // Clamp target weight to safe weekly limits before computing
    const safeTargetWeight = useMemo(
        () => clampTargetWeight(state.currentWeight, state.targetWeight, state.duration),
        [state.currentWeight, state.targetWeight, state.duration]
    );

    // All derived values — recomputed on every state change
    const computed = useMemo(() => {
        const bmr = calcBMR(state.gender, state.currentWeight, state.height, state.age);
        const tdee = calcTDEE(bmr);
        const { dailyTarget, dailyAdjustment } = calcDailyTarget(
            tdee, state.currentWeight, safeTargetWeight, state.duration, state.gender
        );
        const macros = calcMacros(dailyTarget);
        return {
            bmr: Math.round(bmr),
            tdee: Math.round(tdee),
            dailyTarget,
            dailyAdjustment,
            macros,
            isDeficit: safeTargetWeight < state.currentWeight,
            safeTargetWeight,
        };
    }, [state, safeTargetWeight]);

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
                            {/* Input Card */}
                            <CalcInputs state={state} onChange={setState} />

                            {/* Body Visualization */}
                            <BodyViz
                                currentWeight={state.currentWeight}
                                targetWeight={safeTargetWeight}
                                duration={state.duration}
                                gender={state.gender}
                                onDurationChange={(d) => setState(prev => ({ ...prev, duration: d }))}
                            />
                        </div>

                        {/* Motivational Footer */}
                        <div className="calc-page__motivation">
                            <p className="calc-page__quote">
                                <em>Small steps, big changes.</em><br />
                                <em>Keep pushing forward!</em>
                            </p>
                        </div>

                        {/* Height & Weight Reference */}
                        <div className="calc-page__reference">
                            <span className="calc-page__reference-title">General reference range</span>
                            <div className="calc-page__reference-images">
                                <a href="/Ideal height.jpg" target="_blank" rel="noopener noreferrer">
                                    <img src="/Ideal height.jpg" alt="Height conversion reference" className="calc-page__reference-img" />
                                </a>
                                <a href="/Ideal weight.jpg" target="_blank" rel="noopener noreferrer">
                                    <img src="/Ideal weight.jpg" alt="Ideal height and weight reference" className="calc-page__reference-img" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="calc-page__right">
                        <CalorieRing dailyCalories={computed.dailyTarget} computed={computed} state={displayState} />
                        <MacroChart macros={computed.macros} />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Calculator;
