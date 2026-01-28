import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage("Check your email for the confirmation link!");
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
        fontSize: '16px', // Prevents zoom on iOS
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxSizing: 'border-box'
    };

    return (
        <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(1rem, 5vw, 2rem)',
            minHeight: '100%'
        }}>
            {/* Liquid Glass Box */}
            <div style={{
                width: '100%',
                maxWidth: '420px',
                padding: 'clamp(1.5rem, 5vw, 2.5rem)',
                borderRadius: 'clamp(20px, 4vw, 28px)',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.2) 100%)',
                backdropFilter: 'blur(40px) saturate(200%)',
                WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                border: '1.5px solid rgba(255, 255, 255, 0.8)',
                boxShadow: `
                    0 8px 32px rgba(0, 0, 0, 0.12),
                    0 0 0 1px rgba(255, 255, 255, 0.4) inset,
                    0 32px 64px -20px rgba(0, 0, 0, 0.15),
                    0 -1px 0 rgba(255, 255, 255, 0.8) inset
                `
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 'clamp(1.25rem, 4vw, 2rem)' }}>
                    <h1 style={{
                        fontSize: 'clamp(1.5rem, 5vw, 1.75rem)',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        marginBottom: '0.5rem',
                        letterSpacing: '-0.02em'
                    }}>Weight Delta</h1>
                    <p style={{ color: '#666', fontSize: 'clamp(0.8rem, 3vw, 0.875rem)' }}>
                        Create your account
                    </p>
                </div>

                <form onSubmit={handleSignUp}>
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

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            color: '#333',
                            fontSize: '0.875rem',
                            marginBottom: '0.5rem',
                            fontWeight: '500'
                        }}>Password</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            placeholder="Min 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <p style={{
                    textAlign: 'center',
                    marginTop: '1.5rem',
                    color: '#666',
                    fontSize: '0.875rem'
                }}>
                    Already have an account?{" "}
                    <Link to="/login" style={{
                        color: '#1a1a1a',
                        textDecoration: 'none',
                        fontWeight: '600'
                    }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}

export default SignUp;
