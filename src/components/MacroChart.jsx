import { useState } from 'react';
import './MacroChart.css';

const COLORS = {
    protein: '#5865F2',
    carbs: '#00C8FF',
    fat: '#A855F7',
};

export default function MacroChart({ macros }) {
    const [expanded, setExpanded] = useState(true);
    const { protein, carbs, fat } = macros || {
        protein: { pct: 34, grams: 0 },
        carbs: { pct: 42, grams: 0 },
        fat: { pct: 24, grams: 0 },
    };

    // Donut SVG
    const size = 160;
    const stroke = 24;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;

    // Build segments
    const segments = [
        { key: 'protein', pct: protein.pct, color: COLORS.protein },
        { key: 'carbs', pct: carbs.pct, color: COLORS.carbs },
        { key: 'fat', pct: fat.pct, color: COLORS.fat },
    ];

    let cumulativeOffset = 0;

    return (
        <div className="macro-chart">
            <button
                type="button"
                className="macro-chart__header"
                onClick={() => setExpanded(prev => !prev)}
            >
                <span className="macro-chart__title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                    </svg>
                    Macro Breakdown
                </span>
                <span className={`macro-chart__chevron ${expanded ? 'open' : ''}`}>
                    ‹
                </span>
            </button>

            {expanded && (
                <div className="macro-chart__body">
                    <div className="macro-chart__donut">
                        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                            {segments.map((seg) => {
                                const dash = (seg.pct / 100) * circumference;
                                const gap = circumference - dash;
                                const offset = -cumulativeOffset;
                                cumulativeOffset += dash;

                                return (
                                    <circle
                                        key={seg.key}
                                        cx={size / 2} cy={size / 2} r={radius}
                                        fill="none"
                                        stroke={seg.color}
                                        strokeWidth={stroke}
                                        strokeDasharray={`${dash} ${gap}`}
                                        strokeDashoffset={offset}
                                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                                    />
                                );
                            })}
                        </svg>
                    </div>

                    {/* Legend with percentages */}
                    <div className="macro-chart__legend">
                        <div className="macro-chart__item">
                            <span className="macro-chart__swatch" style={{ background: COLORS.protein }} />
                            <span className="macro-chart__item-label">Protein</span>
                            <span className="macro-chart__item-value">{protein.pct}%</span>
                            <span className="macro-chart__item-grams">{protein.grams}g</span>
                        </div>
                        <div className="macro-chart__item">
                            <span className="macro-chart__swatch" style={{ background: COLORS.carbs }} />
                            <span className="macro-chart__item-label">Carbs</span>
                            <span className="macro-chart__item-value">{carbs.pct}%</span>
                            <span className="macro-chart__item-grams">{carbs.grams}g</span>
                        </div>
                        <div className="macro-chart__item">
                            <span className="macro-chart__swatch" style={{ background: COLORS.fat }} />
                            <span className="macro-chart__item-label">Fat</span>
                            <span className="macro-chart__item-value">{fat.pct}%</span>
                            <span className="macro-chart__item-grams">{fat.grams}g</span>
                        </div>
                    </div>

                    {/* Daily Macro Intake (grams per day) */}
                    <div className="macro-chart__daily">
                        <span className="macro-chart__daily-title">Daily Macro Intake (per day)</span>
                        <div className="macro-chart__daily-grid">
                            <div className="macro-chart__daily-item">
                                <span className="macro-chart__daily-value">{protein.grams}g</span>
                                <span className="macro-chart__daily-label">Protein</span>
                                <span className="macro-chart__daily-kcal">{protein.grams * 4} kcal</span>
                            </div>
                            <div className="macro-chart__daily-item">
                                <span className="macro-chart__daily-value">{carbs.grams}g</span>
                                <span className="macro-chart__daily-label">Carbs</span>
                                <span className="macro-chart__daily-kcal">{carbs.grams * 4} kcal</span>
                            </div>
                            <div className="macro-chart__daily-item">
                                <span className="macro-chart__daily-value">{fat.grams}g</span>
                                <span className="macro-chart__daily-label">Fat</span>
                                <span className="macro-chart__daily-kcal">{fat.grams * 9} kcal</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
