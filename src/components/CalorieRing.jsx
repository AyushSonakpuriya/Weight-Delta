import { useState } from 'react';
import './CalorieRing.css';

/**
 * Determine goal feasibility based on weekly weight change and daily adjustment.
 * Returns { label, level } where level is 'comfortable' | 'aggressive' | 'not-recommended'
 */
function getGoalFeasibility(weeklyChange, dailyAdjustment) {
    const absWeekly = Math.abs(weeklyChange);
    const absAdj = Math.abs(dailyAdjustment);

    if (absWeekly <= 0.5 && absAdj <= 500) {
        return { label: 'Comfortable', level: 'comfortable' };
    }
    if (absWeekly <= 0.8 && absAdj <= 750) {
        return { label: 'Aggressive', level: 'aggressive' };
    }
    return { label: 'Not recommended', level: 'not-recommended' };
}

export default function CalorieRing({ dailyCalories, computed, state }) {
    const [showBreakdown, setShowBreakdown] = useState(false);
    const cal = dailyCalories || 0;
    const formatted = cal.toLocaleString();

    // Ring SVG params
    const size = 200;
    const stroke = 18;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;

    // Progress: map calories to ring fill (0-4000 range for visual)
    const maxCal = 4000;
    const progress = Math.min(cal / maxCal, 1);
    const dashOffset = circumference * (1 - progress);

    // Descriptive values
    const cw = state?.currentWeight || 70;
    const tw = state?.targetWeight || 70;
    const dur = state?.duration || 8;
    const weightDiff = Math.abs(tw - cw).toFixed(1);
    const isDeficit = computed?.isDeficit;
    const adjType = isDeficit ? 'deficit' : 'surplus';
    const actionWord = isDeficit ? 'lose' : 'gain';
    const adjAmount = Math.abs(computed?.dailyAdjustment || 0);

    // Goal feasibility
    const weeklyChange = dur > 0 ? Math.abs(tw - cw) / dur : 0;
    const feasibility = getGoalFeasibility(weeklyChange, computed?.dailyAdjustment || 0);

    return (
        <div className="calorie-ring">
            <div className="calorie-ring__header">
                <span className="calorie-ring__title">Live Calorie Preview</span>
                <span className="calorie-ring__dots">
                    <span className="dot" />
                    <span className="dot" />
                </span>
            </div>

            <div className="calorie-ring__chart">
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    {/* Background ring */}
                    <circle
                        cx={size / 2} cy={size / 2} r={radius}
                        fill="none"
                        stroke="#2a2a2a"
                        strokeWidth={stroke}
                    />
                    {/* Outer thin ring */}
                    <circle
                        cx={size / 2} cy={size / 2} r={radius + 8}
                        fill="none"
                        stroke="#222"
                        strokeWidth={2}
                    />
                    {/* Progress ring */}
                    <circle
                        cx={size / 2} cy={size / 2} r={radius}
                        fill="none"
                        stroke="#4B5563"
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                        className="calorie-ring__progress"
                    />
                </svg>
                <div className="calorie-ring__value">
                    <span className="calorie-ring__number">{formatted}</span>
                    <span className="calorie-ring__label">Estimated Daily Calories</span>
                </div>
            </div>

            {/* Descriptive Summary */}
            <div className="calorie-ring__summary">
                <p className="calorie-ring__desc">
                    To {actionWord} <strong style={{ color: '#00C8FF' }}>{weightDiff} kg</strong> in <strong>{dur} weeks</strong>,
                    eat approximately <strong style={{ color: '#5865F2' }}>{formatted} cal/day</strong> — a
                    daily {adjType} of <strong style={{ color: '#00C8FF' }}>{adjAmount} cal</strong> from maintenance.
                </p>

                {/* Goal Feasibility Indicator */}
                <div className={`calorie-ring__feasibility calorie-ring__feasibility--${feasibility.level}`}>
                    <span className="calorie-ring__feasibility-dot" />
                    <span className="calorie-ring__feasibility-label">{feasibility.label}</span>
                    <span className="calorie-ring__feasibility-rate">({weeklyChange.toFixed(2)} kg/week)</span>
                </div>
            </div>

            {/* Reassurance Micro-Fact */}
            <p className="calorie-ring__reassurance">
                Missing a day won't break progress. Consistency over weeks matters more than perfection.
            </p>

            {/* Expandable Full Breakdown */}
            <button
                type="button"
                className="calorie-ring__expand-btn"
                onClick={() => setShowBreakdown(prev => !prev)}
            >
                {showBreakdown ? 'Hide breakdown' : 'View full breakdown'}
                <span className={`calorie-ring__expand-icon ${showBreakdown ? 'open' : ''}`}>‹</span>
            </button>

            {showBreakdown && (
                <div className="calorie-ring__breakdown">
                    <div className="calorie-ring__breakdown-row">
                        <span className="calorie-ring__breakdown-label">BMR</span>
                        <span className="calorie-ring__breakdown-value">{computed?.bmr?.toLocaleString()} cal</span>
                    </div>
                    <div className="calorie-ring__breakdown-row">
                        <span className="calorie-ring__breakdown-label">Maintenance (TDEE)</span>
                        <span className="calorie-ring__breakdown-value">{computed?.tdee?.toLocaleString()} cal</span>
                    </div>
                    <div className="calorie-ring__breakdown-row">
                        <span className="calorie-ring__breakdown-label">Daily Target</span>
                        <span className="calorie-ring__breakdown-value calorie-ring__breakdown-value--bold">{formatted} cal</span>
                    </div>
                    <div className="calorie-ring__breakdown-row">
                        <span className="calorie-ring__breakdown-label">Daily {adjType}</span>
                        <span className="calorie-ring__breakdown-value">{isDeficit ? '−' : '+'}{adjAmount} cal</span>
                    </div>
                    <p className="calorie-ring__breakdown-note">
                        Your BMR ({computed?.bmr?.toLocaleString()} cal) is multiplied by 1.2 (sedentary) to get maintenance ({computed?.tdee?.toLocaleString()} cal).
                        To {actionWord} {weightDiff} kg over {dur} weeks, a daily {adjType} of {adjAmount} cal is applied.
                    </p>
                </div>
            )}
        </div>
    );
}
