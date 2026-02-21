import { useState, useEffect, useRef } from 'react';
import { clampValue, clampTargetWeight } from '../lib/calorieCalc';
import './CalcInputs.css';

const genderOptions = [
    { value: 'male', label: 'Male', icon: '♂' },
    { value: 'female', label: 'Female', icon: '♀' },
    { value: 'other', label: 'Other', icon: '⚥' },
];

const durationOptions = [4, 8, 12];

// Ranges for each numeric field
const RANGES = {
    age: { min: 15, max: 80, step: 1, parse: parseInt },
    height: { min: 100, max: 250, step: 1, parse: parseInt },
    currentWeight: { min: 30, max: 200, step: 0.1, parse: parseFloat },
    targetWeight: { min: 30, max: 200, step: 0.1, parse: parseFloat },
};

const CORRECTION_HIDE_MS = 4000;

export default function CalcInputs({ state, onChange }) {
    // Local draft strings for free typing — not clamped until blur
    const [drafts, setDrafts] = useState({});
    // Auto-correction notice
    const [correction, setCorrection] = useState(null);
    const correctionTimer = useRef(null);

    // Clear correction after timeout
    useEffect(() => {
        return () => {
            if (correctionTimer.current) clearTimeout(correctionTimer.current);
        };
    }, []);

    const showCorrection = (msg) => {
        setCorrection(msg);
        if (correctionTimer.current) clearTimeout(correctionTimer.current);
        correctionTimer.current = setTimeout(() => setCorrection(null), CORRECTION_HIDE_MS);
    };

    const set = (key, raw) => {
        const val = typeof raw === 'string' ? raw : Number(raw);
        onChange({ ...state, [key]: val });
    };

    // Slider: always commits immediately (already clamped by browser)
    const handleSlider = (key, e) => {
        const range = RANGES[key];
        const val = range.parse(e.target.value);
        setDrafts(prev => ({ ...prev, [key]: undefined })); // clear draft

        if (key === 'targetWeight') {
            // Clamp to safe weekly limits immediately for slider
            const safe = clampTargetWeight(state.currentWeight, val, state.duration);
            if (safe !== val) {
                const diff = val < state.currentWeight ? 'loss' : 'gain';
                const limit = diff === 'loss' ? '1.0' : '0.5';
                showCorrection(`Adjusted to ${safe} kg (max ${limit} kg/week ${diff})`);
            }
            set(key, safe);
        } else {
            set(key, val);
        }
    };

    // Number input: free typing — store as draft string, don't clamp
    const handleNumTyping = (key, e) => {
        const raw = e.target.value;
        setDrafts(prev => ({ ...prev, [key]: raw }));
        // For non-target fields, update state for live preview
        // For target weight, DON'T update state during typing — only on blur
        if (key !== 'targetWeight') {
            const range = RANGES[key];
            const parsed = range.parse(raw);
            if (!isNaN(parsed)) {
                set(key, parsed);
            }
        }
    };

    // Blur: validate and clamp
    const handleNumBlur = (key) => {
        const range = RANGES[key];
        const raw = drafts[key] !== undefined ? drafts[key] : state[key];
        let clamped = clampValue(raw, range.min, range.max);

        if (key === 'targetWeight') {
            // Additionally enforce safe weekly limits
            const safe = clampTargetWeight(state.currentWeight, clamped, state.duration);
            if (safe !== clamped) {
                const diff = clamped < state.currentWeight ? 'loss' : 'gain';
                const limit = diff === 'loss' ? '1.0' : '0.5';
                showCorrection(`Adjusted to ${safe} kg (max ${limit} kg/week ${diff})`);
                clamped = safe;
            }
        }

        setDrafts(prev => ({ ...prev, [key]: undefined }));
        set(key, clamped);
    };

    // Display value: show draft while typing, otherwise show state
    const displayVal = (key) => {
        return drafts[key] !== undefined ? drafts[key] : state[key];
    };

    // Slider value: always from state (clamped range)
    const sliderVal = (key) => {
        const range = RANGES[key];
        return Math.max(range.min, Math.min(range.max, state[key] || range.min));
    };

    // Compute slider fill percentage for gradient background
    const sliderFillStyle = (key) => {
        const range = RANGES[key];
        const val = sliderVal(key);
        const pct = ((val - range.min) / (range.max - range.min)) * 100;
        return {
            background: `linear-gradient(90deg, #5865F2 0%, #3F4BD8 ${pct}%, #333 ${pct}%)`,
        };
    };

    return (
        <div className="calc-inputs">
            {/* ----- Gender ----- */}
            <div className="calc-inputs__section">
                <label className="calc-inputs__label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M6 21v-2a6 6 0 0 1 12 0v2" /></svg>
                    Gender
                </label>
                <div className="calc-inputs__segments">
                    {genderOptions.map(g => (
                        <button
                            key={g.value}
                            type="button"
                            className={`calc-inputs__seg-btn gender-${g.value} ${state.gender === g.value ? 'active' : ''}`}
                            onClick={() => set('gender', g.value)}
                        >
                            <span className="seg-icon">{g.icon}</span> {g.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ----- Age ----- */}
            <div className="calc-inputs__section">
                <div className="calc-inputs__label-row">
                    <label className="calc-inputs__label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M6 21v-2a6 6 0 0 1 12 0v2" /></svg>
                        Age
                    </label>
                    <input
                        type="number"
                        className="calc-inputs__num"
                        value={displayVal('age')}
                        onChange={e => handleNumTyping('age', e)}
                        onBlur={() => handleNumBlur('age')}
                    />
                </div>
                <input
                    type="range"
                    className="calc-inputs__slider"
                    min={15} max={80}
                    value={sliderVal('age')}
                    onChange={e => handleSlider('age', e)}
                    style={sliderFillStyle('age')}
                />
            </div>

            {/* ----- Height ----- */}
            <div className="calc-inputs__section">
                <div className="calc-inputs__label-row">
                    <label className="calc-inputs__label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M8 6l4-4 4 4M8 18l4 4 4-4" /></svg>
                        Height
                    </label>
                    <div className="calc-inputs__num-unit">
                        <input
                            type="number"
                            className="calc-inputs__num"
                            value={displayVal('height')}
                            onChange={e => handleNumTyping('height', e)}
                            onBlur={() => handleNumBlur('height')}
                        />
                        <span className="calc-inputs__unit">cm</span>
                    </div>
                </div>
                <input
                    type="range"
                    className="calc-inputs__slider"
                    min={100} max={250}
                    value={sliderVal('height')}
                    onChange={e => handleSlider('height', e)}
                    style={sliderFillStyle('height')}
                />
            </div>

            {/* ----- Current Weight ----- */}
            <div className="calc-inputs__section">
                <div className="calc-inputs__label-row">
                    <label className="calc-inputs__label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                        Current Weight
                    </label>
                    <div className="calc-inputs__num-unit">
                        <input
                            type="number"
                            className="calc-inputs__num"
                            value={displayVal('currentWeight')}
                            onChange={e => handleNumTyping('currentWeight', e)}
                            onBlur={() => handleNumBlur('currentWeight')}
                        />
                        <span className="calc-inputs__unit">kg</span>
                    </div>
                </div>
                <input
                    type="range"
                    className="calc-inputs__slider"
                    min={30} max={200}
                    value={sliderVal('currentWeight')}
                    onChange={e => handleSlider('currentWeight', e)}
                    style={sliderFillStyle('currentWeight')}
                />
            </div>

            {/* ----- Target Weight ----- */}
            <div className="calc-inputs__section">
                <div className="calc-inputs__label-row">
                    <label className="calc-inputs__label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
                        Target Weight
                    </label>
                    <div className="calc-inputs__num-unit">
                        <input
                            type="number"
                            className="calc-inputs__num"
                            value={displayVal('targetWeight')}
                            onChange={e => handleNumTyping('targetWeight', e)}
                            onBlur={() => handleNumBlur('targetWeight')}
                        />
                        <span className="calc-inputs__unit">kg</span>
                    </div>
                </div>
                <input
                    type="range"
                    className="calc-inputs__slider"
                    min={30} max={200}
                    value={sliderVal('targetWeight')}
                    onChange={e => handleSlider('targetWeight', e)}
                    style={sliderFillStyle('targetWeight')}
                />

                {/* Auto-correction notice */}
                {correction && (
                    <div className="calc-inputs__correction">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
                        {correction}
                    </div>
                )}
            </div>

            {/* ----- Duration ----- */}
            <div className="calc-inputs__section">
                <div className="calc-inputs__segments calc-inputs__segments--sm">
                    {durationOptions.map(d => (
                        <button
                            key={d}
                            type="button"
                            className={`calc-inputs__seg-btn ${state.duration === d ? 'active' : ''}`}
                            onClick={() => set('duration', d)}
                        >
                            {d} weeks
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
