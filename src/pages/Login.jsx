import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            if (data.session) {
                window.location.href = "/calculator";
            }
        });

        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        }

        setLoading(false);
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError("Please enter your email address first");
            return;
        }
        setLoading(true);
        setError("");
        setMessage("");

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage("Password reset email sent! Check your inbox.");
        }
        setLoading(false);
    };

    const inputStyle = {
        width: '100%',
        padding: '0.875rem 1rem',
        borderRadius: '12px',
        border: '1px solid #ddd',
        background: 'rgba(255, 255, 255, 0.9)',
        color: '#1a1a1a',
        fontSize: '16px',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxSizing: 'border-box'
    };

    return (
        <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: isDesktop ? 'center' : 'center',
            padding: 'clamp(1rem, 5vw, 2rem)',
            paddingRight: isDesktop ? '5%' : 'clamp(1rem, 5vw, 2rem)',
            paddingLeft: isDesktop ? '5%' : 'clamp(1rem, 5vw, 2rem)',
            minHeight: '100%',
            gap: isDesktop ? '5rem' : '0'
        }}>
            {isDesktop && (
                <div style={{
                    flex: '0 0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <img
                        src="/unnamed.gif"
                        alt="Login illustration"
                        style={{
                            maxWidth: '480px',
                            width: '100%',
                            height: 'auto',
                        }}
                    />
                </div>
            )}

            <div style={{
                width: '100%',
                maxWidth: '420px',
                padding: 'clamp(1.5rem, 5vw, 2.5rem)',
                borderRadius: 'clamp(20px, 4vw, 28px)',
                background: `
                    linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(240, 248, 255, 0.3) 100%),
                    linear-gradient(to bottom, rgba(255, 255, 255, 0.8) 0%, transparent 40%),
                    radial-gradient(ellipse at 30% 0%, rgba(255, 255, 255, 0.9) 0%, transparent 50%)
                `,
                backdropFilter: 'blur(24px) saturate(180%) brightness(1.1)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%) brightness(1.1)',
                border: '1px solid rgba(255, 255, 255, 0.7)',
                boxShadow: `
                    0 8px 32px rgba(0, 0, 0, 0.08),
                    0 25px 50px -12px rgba(0, 0, 0, 0.12),
                    inset 0 1px 0 rgba(255, 255, 255, 1),
                    inset 0 -1px 0 rgba(255, 255, 255, 0.4),
                    inset 1px 0 0 rgba(255, 255, 255, 0.5),
                    inset -1px 0 0 rgba(255, 255, 255, 0.5),
                    0 0 0 1px rgba(255, 255, 255, 0.3),
                    0 0 80px -20px rgba(100, 180, 255, 0.15)
                `,
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '50%',
                    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 30%, transparent 100%)',
                    borderRadius: 'clamp(20px, 4vw, 28px) clamp(20px, 4vw, 28px) 0 0',
                    pointerEvents: 'none'
                }} />
                <div style={{ textAlign: 'center', marginBottom: 'clamp(1.25rem, 4vw, 2rem)' }}>
                    <h1 style={{
                        fontSize: 'clamp(1.5rem, 5vw, 1.75rem)',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        marginBottom: '0.5rem',
                        letterSpacing: '-0.02em'
                    }}>Weight Delta</h1>
                    <p style={{ color: '#666', fontSize: 'clamp(0.8rem, 3vw, 0.875rem)' }}>
                        Sign in to continue
                    </p>
                </div>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{
                            display: 'block',
                            color: '#333',
                            fontSize: '0.875rem',
                            marginBottom: '0.5rem',
                            fontWeight: '500'
                        }}>Email</label>
                        <input
                            type="email"
                            required
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={inputStyle}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#1a1a1a';
                                e.target.style.boxShadow = '0 0 0 3px rgba(26, 26, 26, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#ddd';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '0.5rem' }}>
                        <label style={{
                            display: 'block',
                            color: '#333',
                            fontSize: '0.875rem',
                            marginBottom: '0.5rem',
                            fontWeight: '500'
                        }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ ...inputStyle, paddingRight: '3rem' }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#1a1a1a';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(26, 26, 26, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#ddd';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#666'
                                }}
                            >
                                {showPassword ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            disabled={loading}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#666',
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                padding: 0
                            }}
                        >
                            Forgot password?
                        </button>
                    </div>

                    {error && (
                        <p style={{
                            color: '#dc2626',
                            fontSize: '0.875rem',
                            marginBottom: '1rem',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            background: 'rgba(220, 38, 38, 0.08)',
                            border: '1px solid rgba(220, 38, 38, 0.2)'
                        }}>{error}</p>
                    )}

                    {message && (
                        <p style={{
                            color: '#059669',
                            fontSize: '0.875rem',
                            marginBottom: '1rem',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            background: 'rgba(5, 150, 105, 0.08)',
                            border: '1px solid rgba(5, 150, 105, 0.2)'
                        }}>{message}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '0.875rem',
                            borderRadius: '12px',
                            border: 'none',
                            background: '#1a1a1a',
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.6 : 1,
                            transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s',
                            WebkitTapHighlightColor: 'transparent'
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.target.style.background = '#333';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = '#1a1a1a';
                        }}
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <p style={{
                    textAlign: 'center',
                    marginTop: '1.5rem',
                    color: '#666',
                    fontSize: '0.875rem'
                }}>
                    Don't have an account?{" "}
                    <Link to="/signup" style={{
                        color: '#1a1a1a',
                        textDecoration: 'none',
                        fontWeight: '600'
                    }}>Sign up</Link>
                </p>
            </div>
        </div>
    );
}
