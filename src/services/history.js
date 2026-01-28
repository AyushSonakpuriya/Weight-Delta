import { supabase } from "../lib/supabase";

export async function fetchUserHistory() {
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
        .from("calculations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        throw error;
    }

    return data;
}
