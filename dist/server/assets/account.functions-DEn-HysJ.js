import { a2 as TSS_SERVER_FUNCTION, a3 as createServerFn } from "./server-BbznTnLG.js";
import { c as createClient } from "./index-B6C1Fcum.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
function createSupabaseAdminClient() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    const missing = [
      ...!SUPABASE_URL ? ["SUPABASE_URL"] : [],
      ...!SUPABASE_SERVICE_ROLE_KEY ? ["SUPABASE_SERVICE_ROLE_KEY"] : []
    ];
    const message = `Missing Supabase environment variable(s): ${missing.join(", ")}. Connect Supabase in Lovable Cloud.`;
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      storage: void 0,
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
let _supabaseAdmin;
const supabaseAdmin = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
    return Reflect.get(_supabaseAdmin, prop, receiver);
  }
});
const deleteMyAccount_createServerFn_handler = createServerRpc({
  id: "27301031363e284184ead21ac910c33ebfbe9159435c975f26319c6a65fade88",
  name: "deleteMyAccount",
  filename: "src/lib/account.functions.ts"
}, (opts) => deleteMyAccount.__executeServer(opts));
const deleteMyAccount = createServerFn({
  method: "POST"
}).handler(deleteMyAccount_createServerFn_handler, async ({
  data
}) => {
  const userId = typeof data?.userId === "string" ? data.userId : void 0;
  if (!userId) {
    throw new Error("Missing userId for account deletion.");
  }
  const {
    error: complaintError
  } = await supabaseAdmin.from("complaints").delete().eq("user_id", userId);
  if (complaintError) {
    throw complaintError;
  }
  const {
    error: userRoleError
  } = await supabaseAdmin.from("user_roles").delete().eq("user_id", userId);
  if (userRoleError) {
    throw userRoleError;
  }
  const {
    error: profileError
  } = await supabaseAdmin.from("profiles").delete().eq("id", userId);
  if (profileError) {
    throw profileError;
  }
  const {
    error: authError
  } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (authError) {
    throw authError;
  }
  return {
    success: true
  };
});
export {
  deleteMyAccount_createServerFn_handler
};
