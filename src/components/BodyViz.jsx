import './BodyViz.css';

const durationOptions = [4, 8, 12];

/* ===== Gender-specific SVG silhouettes ===== */

function MaleSilhouette({ scale = 1 }) {
    return (
        <svg viewBox="0 0 60 120" className="body-viz__silhouette" style={{ transform: `scaleX(${scale})` }}>
            {/* Head */}
            <circle cx="30" cy="14" r="9" fill="currentColor" />
            {/* Neck */}
            <rect x="26" y="23" width="8" height="6" rx="2" fill="currentColor" />
            {/* Shoulders + Torso */}
            <path d="M12 32 Q12 28, 18 28 L42 28 Q48 28, 48 32 L46 60 Q46 65, 42 66 L18 66 Q14 65, 14 60 Z" fill="currentColor" />
            {/* Left Arm */}
            <path d="M12 32 Q6 34, 7 48 L9 58 Q10 62, 13 60 L14 46 Z" fill="currentColor" />
            {/* Right Arm */}
            <path d="M48 32 Q54 34, 53 48 L51 58 Q50 62, 47 60 L46 46 Z" fill="currentColor" />
            {/* Left Leg */}
            <rect x="17" y="66" width="11" height="38" rx="5" fill="currentColor" />
            {/* Right Leg */}
            <rect x="32" y="66" width="11" height="38" rx="5" fill="currentColor" />
        </svg>
    );
}

function FemaleSilhouette({ scale = 1 }) {
    return (
        <svg viewBox="0 0 60 120" className="body-viz__silhouette" style={{ transform: `scaleX(${scale})` }}>
            {/* Head */}
            <circle cx="30" cy="12" r="9" fill="currentColor" />
            {/* Hair accent */}
            <ellipse cx="30" cy="8" rx="10" ry="5" fill="currentColor" />
            {/* Neck */}
            <rect x="27" y="21" width="6" height="5" rx="2" fill="currentColor" />
            {/* Torso - hourglass */}
            <path d="M16 30 Q15 26, 20 26 L40 26 Q45 26, 44 30 L42 44 Q40 48, 38 48 L22 48 Q20 48, 18 44 Z" fill="currentColor" />
            {/* Hips */}
            <path d="M18 48 Q14 48, 13 54 L15 68 Q16 70, 20 70 L40 70 Q44 70, 45 68 L47 54 Q46 48, 42 48 Z" fill="currentColor" />
            {/* Left Arm */}
            <path d="M16 30 Q10 32, 10 44 L12 54 Q13 58, 15 56 L17 42 Z" fill="currentColor" />
            {/* Right Arm */}
            <path d="M44 30 Q50 32, 50 44 L48 54 Q47 58, 45 56 L43 42 Z" fill="currentColor" />
            {/* Left Leg */}
            <rect x="18" y="70" width="10" height="36" rx="4" fill="currentColor" />
            {/* Right Leg */}
            <rect x="32" y="70" width="10" height="36" rx="4" fill="currentColor" />
        </svg>
    );
}

export default function BodyViz({ currentWeight, targetWeight, duration, onDurationChange, gender }) {
    const cw = parseFloat(currentWeight) || 70;
    const tw = parseFloat(targetWeight) || cw;
    const isLoss = tw < cw;
    const isGain = tw > cw;

    // Scale factor for target body (subtle visual change)
    const weightRatio = cw > 0 ? tw / cw : 1;
    const targetScale = Math.max(0.8, Math.min(1.2, weightRatio));

    const isFemale = gender === 'female' || gender === 'other';
    const Body = isFemale ? FemaleSilhouette : MaleSilhouette;

    return (
        <div className="body-viz">
            {/* Duration Selector */}
            <div className="body-viz__duration">
                {durationOptions.map(d => (
                    <button
                        key={d}
                        type="button"
                        className={`body-viz__dur-btn ${duration === d ? 'active' : ''}`}
                        onClick={() => onDurationChange(d)}
                    >
                        {d} weeks
                    </button>
                ))}
            </div>

            {/* Weight Input for target (mirrors reference) */}
            <div className="body-viz__weight-input">
                <label className="body-viz__weight-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
                    Target Weight
                </label>
                <div className="body-viz__weight-num-unit">
                    <input
                        type="number"
                        className="body-viz__weight-num"
                        value={tw}
                        min={30} max={200}
                        step={0.1}
                        onChange={e => {
                            const v = parseFloat(e.target.value) || 30;
                            onDurationChange.__setTarget?.(v);
                        }}
                        readOnly
                    />
                    <span className="body-viz__weight-unit">kg</span>
                </div>
            </div>

            {/* Body Silhouettes */}
            <div className="body-viz__figures">
                <div className="body-viz__figure">
                    <Body scale={1} />
                    <span className="body-viz__figure-label">Current</span>
                </div>

                <div className="body-viz__arrow">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                </div>

                <div className="body-viz__figure">
                    <Body scale={targetScale} />
                    <span className="body-viz__figure-label">Target</span>
                </div>
            </div>

            {/* Weight Labels */}
            <div className="body-viz__weights">
                <span className="body-viz__weight">{cw} kg</span>
                <span className="body-viz__weight-arrow">›</span>
                <span className={`body-viz__weight ${isLoss ? 'body-viz__weight--loss' : ''} ${isGain ? 'body-viz__weight--gain' : ''}`}>{tw} kg</span>
            </div>

            {/* Motivational Badges */}
            <div className="body-viz__badges">
                <div className="body-viz__badge">
                    <span className="body-viz__badge-icon">🚀</span>
                    <span className="body-viz__badge-text">You Can<br />Start Slow</span>
                </div>
                <div className="body-viz__badge">
                    <span className="body-viz__badge-icon">🏔</span>
                    <span className="body-viz__badge-text">One Step<br />Closer</span>
                </div>
                <div className="body-viz__badge">
                    <span className="body-viz__badge-icon">🏆</span>
                    <span className="body-viz__badge-text">Progress<br />Winner</span>
                </div>
            </div>
        </div>
    );
}
