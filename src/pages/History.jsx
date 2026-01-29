import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function History() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            console.log("=== DATA FLOW VERIFICATION ===");
            console.log("1. Session exists:", !!session);
            console.log("   Session error:", sessionError);

            if (!session) {
                console.log("❌ No session - user not authenticated");
                setLoading(false);
                return;
            }

            console.log("2. User ID:", session.user.id);
            console.log("   Expected: 1c9a0a61-86db-4e6b-95c1-8c7128dc4bd6");
            console.log("   Match:", session.user.id === "1c9a0a61-86db-4e6b-95c1-8c7128dc4bd6");

            const { data, error } = await supabase
                .from("calculations")
                .select("*")
                .order("created_at", { ascending: false });

            console.log("3. Fetch error:", error);
            console.log("4. Rows returned:", data ? data.length : 0);
            console.log("5. Data:", data);

            if (data && data.length === 0) {
                console.log("📋 RESULT: User has NO history in calculations table");
                console.log("   (Either no inserts yet, or RLS is blocking visibility)");
            } else if (data && data.length > 0) {
                console.log("✅ RESULT: User has", data.length, "calculation(s)");
            }
            console.log("=== END VERIFICATION ===");

            if (error) {
                console.error("History fetch error:", error);
            } else {
                setHistory(data || []);
            }

            setLoading(false);
        };

        fetchHistory();
    }, []);

    if (loading) return <p>Loading history...</p>;

    if (history.length === 0) {
        return <p>No history yet</p>;
    }

    return (
        <div>
            <h2>History</h2>

            {history.map((item) => (
                <div key={item.id} style={{ border: "1px solid #444", marginBottom: "10px", padding: "10px" }}>
                    <p>Date: {new Date(item.created_at).toLocaleString()}</p>
                    <p>Current weight: {item.current_weight}</p>
                    <p>Desired weight: {item.desired_weight}</p>
                    <p>Daily calories: {item.daily_calories}</p>
                </div>
            ))}
        </div>
    );
}
