import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";
import "../Login.css";

function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSignUp = async (e) => {
        e.preventDefault();
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
    };

    return (
        <div className="login">
            <h1>Sign Up</h1>

            <form onSubmit={handleSignUp}>
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <input
                        type="password"
                        placeholder="Password (min 6 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={6}
                        required
                    />
                </div>

                <button type="submit">Sign Up</button>

                {error && <p style={{ color: "red" }}>{error}</p>}
                {message && <p style={{ color: "green" }}>{message}</p>}
            </form>

            <p style={{ marginTop: "16px" }}>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}

export default SignUp;
