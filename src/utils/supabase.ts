import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ogjcwsutcmebdpdtdlxd.supabase.co";
const supabaseAnonKey = "sb_publishable_VrD4hqCX1rVd_nRelo9ZQg_RWLsRfLp";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
