import { ArrowRight, Repeat2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useState, useMemo, memo, useCallback } from "react";
import { cn } from "@/lib/utils";

const HistoryCard = memo(function HistoryCard({ item }) {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleMouseEnter = useCallback(() => setIsFlipped(true), []);
    const handleMouseLeave = useCallback(() => setIsFlipped(false), []);

    const { formattedDate, formattedTime, weightDiff, TrendIcon, trendLabel, features } = useMemo(() => {
        const date = new Date(item.created_at);
        const fDate = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
        const fTime = date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });

        const wDiff = item.desired_weight - item.current_weight;
        const isGain = wDiff > 0;
        const isLoss = wDiff < 0;

        return {
            formattedDate: fDate,
            formattedTime: fTime,
            weightDiff: wDiff,
            TrendIcon: isGain ? TrendingUp : isLoss ? TrendingDown : Minus,
            trendLabel: isGain ? "Gain" : isLoss ? "Loss" : "Maintain",
            features: [
                `Current Weight: ${item.current_weight} kg`,
                `Target Weight: ${item.desired_weight} kg`,
                `Daily Calories: ${item.daily_calories} kcal`,
                `Difference: ${wDiff > 0 ? "+" : ""}${wDiff.toFixed(1)} kg`,
            ],
        };
    }, [item.created_at, item.desired_weight, item.current_weight, item.daily_calories]);

    return (
        <div
            className="group relative"
            style={{ width: '100%', height: '320px', perspective: '2000px' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.7s',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    willChange: 'transform',
                }}
            >
                {/* ===== FRONT FACE ===== */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(0deg)',
                        willChange: 'transform, opacity',
                        borderRadius: '1rem',
                        overflow: 'hidden',
                        border: '1px solid rgba(63, 63, 70, 0.5)',
                        opacity: isFlipped ? 0 : 1,
                        transition: 'opacity 0.7s',
                        background: '#0a0a0a',
                    }}
                >
                    {/* Glow animation — centered */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {GLOW_INDICES.map((i) => (
                            <div
                                className="history-glow-orb"
                                key={i}
                                style={{
                                    position: 'absolute',
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '140px',
                                    animationDelay: `${i * 0.3}s`,
                                }}
                            />
                        ))}
                    </div>

                    {/* Bottom text overlay */}
                    <div style={{ position: 'absolute', right: 0, bottom: 0, left: 0, padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                            <div>
                                <h3 style={{ fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.4, color: '#fff', letterSpacing: '-0.05em' }}>
                                    {formattedDate}
                                </h3>
                                <p style={{ fontSize: '0.875rem', color: '#e4e4e7', letterSpacing: '-0.025em', marginTop: '4px' }}>
                                    {trendLabel} · {formattedTime}
                                </p>
                            </div>
                            <Repeat2 style={{ width: '16px', height: '16px', color: '#f97316' }} />
                        </div>
                    </div>
                </div>

                {/* ===== BACK FACE ===== */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        willChange: 'transform, opacity',
                        borderRadius: '1rem',
                        padding: '24px',
                        background: 'linear-gradient(to bottom, #18181b, #000)',
                        border: '1px solid #27272a',
                        display: 'flex',
                        flexDirection: 'column',
                        opacity: isFlipped ? 1 : 0,
                        transition: 'opacity 0.7s',
                    }}
                >
                    <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <TrendIcon style={{ width: '20px', height: '20px', color: '#f97316' }} />
                                <h3 style={{ fontWeight: 600, fontSize: '1.125rem', color: '#fff', letterSpacing: '-0.025em' }}>
                                    {formattedDate}
                                </h3>
                            </div>
                            <p style={{ fontSize: '0.875rem', color: '#a1a1aa' }}>
                                Calculation recorded at {formattedTime}
                            </p>
                        </div>

                        <div>
                            {features.map((feature, index) => (
                                <div
                                    key={feature}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '0.875rem',
                                        color: '#d4d4d8',
                                        marginBottom: '6px',
                                        transform: isFlipped ? 'translateX(0)' : 'translateX(-10px)',
                                        opacity: isFlipped ? 1 : 0,
                                        transition: 'transform 0.5s, opacity 0.5s',
                                        transitionDelay: `${index * 100 + 200}ms`,
                                        willChange: 'transform, opacity',
                                    }}
                                >
                                    <ArrowRight style={{ width: '12px', height: '12px', color: '#f97316', flexShrink: 0 }} />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #27272a', paddingTop: '16px', marginTop: '16px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px',
                            borderRadius: '12px',
                            background: '#27272a',
                            cursor: 'pointer',
                        }}>
                            <span style={{ fontWeight: 500, fontSize: '0.875rem', color: '#fff' }}>
                                {item.daily_calories} kcal / day
                            </span>
                            <ArrowRight style={{ width: '16px', height: '16px', color: '#f97316' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

// Static array to avoid re-creating on every render
const GLOW_INDICES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export default HistoryCard;
