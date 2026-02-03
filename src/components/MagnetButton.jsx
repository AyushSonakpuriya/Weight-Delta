import { useRef, useState, useCallback } from 'react';
import './MagnetButton.css';

function MagnetButton({
    children,
    onClick,
    disabled = false,
    type = 'button',
    className = '',
    glareEnabled = false,
    magnetStrength = 0.4,
    style = {}
}) {
    const buttonRef = useRef(null);
    const [sparks, setSparks] = useState([]);
    const sparkIdRef = useRef(0);

    // Handle mouse move for magnet effect
    const handleMouseMove = useCallback((e) => {
        if (disabled || !buttonRef.current) return;

        const button = buttonRef.current;
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) * magnetStrength;
        const deltaY = (e.clientY - centerY) * magnetStrength;

        button.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    }, [disabled, magnetStrength]);

    // Reset position on mouse leave
    const handleMouseLeave = useCallback(() => {
        if (buttonRef.current) {
            buttonRef.current.style.transform = 'translate(0, 0)';
        }
    }, []);

    // Generate sparks on click
    const handleClick = useCallback((e) => {
        if (disabled) return;

        const button = buttonRef.current;
        if (!button) return;

        const rect = button.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Create multiple spark particles
        const newSparks = [];
        const sparkCount = 12;

        for (let i = 0; i < sparkCount; i++) {
            const angle = (Math.PI * 2 / sparkCount) * i + (Math.random() - 0.5) * 0.5;
            const distance = 40 + Math.random() * 60;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;

            newSparks.push({
                id: sparkIdRef.current++,
                x: clickX,
                y: clickY,
                dx,
                dy
            });
        }

        setSparks(prev => [...prev, ...newSparks]);

        // Clean up sparks after animation
        setTimeout(() => {
            setSparks(prev => prev.filter(s => !newSparks.find(ns => ns.id === s.id)));
        }, 600);

        if (onClick) {
            onClick(e);
        }
    }, [disabled, onClick]);

    return (
        <button
            ref={buttonRef}
            type={type}
            disabled={disabled}
            className={`magnet-button ${glareEnabled ? 'glare-enabled' : ''} ${className}`}
            style={style}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            {glareEnabled && <div className="magnet-button__glare" />}
            <div className="magnet-button__sparks">
                {sparks.map(spark => (
                    <div
                        key={spark.id}
                        className="spark"
                        style={{
                            left: spark.x,
                            top: spark.y,
                            '--dx': `${spark.dx}px`,
                            '--dy': `${spark.dy}px`
                        }}
                    />
                ))}
            </div>
            <span className="magnet-button__content">{children}</span>
        </button>
    );
}

export default MagnetButton;
