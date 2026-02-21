import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import HistoryCard from "../components/HistoryCard";

export default function History() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (!session || sessionError) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from("calculations")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("History fetch error:", error);
            } else {
                setHistory(data || []);
            }

            setLoading(false);
        };

        fetchHistory();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', minHeight: '60vh', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#a1a1aa', fontSize: '1.125rem' }}>Loading history...</p>
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div style={{ display: 'flex', minHeight: '60vh', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#a1a1aa', fontSize: '1.125rem' }}>No history yet</p>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 24px', paddingTop: 'calc(var(--navbar-height, 64px) + 40px)', paddingBottom: '48px' }}>
            <h2 style={{ marginBottom: '32px', textAlign: 'center', fontSize: '1.875rem', fontWeight: 600, letterSpacing: '-0.025em', color: 'var(--color-black)' }}>
                History
            </h2>

            <div className="history-grid">
                {history.map((item) => (
                    <HistoryCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
}
