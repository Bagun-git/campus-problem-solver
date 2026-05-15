import { c as createClient } from "./index-B6C1Fcum.js";
function createSupabaseClient() {
  const SUPABASE_URL = "https://lqwlbhnmkclnmqyhonzv.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxxd2xiaG5ta2Nsbm1xeWhvbnp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MjAxMTEsImV4cCI6MjA5NDI5NjExMX0.m5-n3ukIsBB2rVvA2brXeutQFsFWm471ciqwYKQ94DM";
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : void 0,
      persistSession: true,
      autoRefreshToken: true
    }
  });
}
let _supabase;
const supabase = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  }
});
export {
  supabase as s
};
