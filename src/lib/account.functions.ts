import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const deleteMyAccount = createServerFn({ method: "POST" }).handler(
  async ({ data }) => {
    const userId = typeof data?.userId === "string" ? data.userId : undefined;

    if (!userId) {
      throw new Error("Missing userId for account deletion.");
    }

    const { error: complaintError } = await supabaseAdmin.from("complaints").delete().eq("user_id", userId);
    if (complaintError) {
      throw complaintError;
    }

    const { error: userRoleError } = await supabaseAdmin.from("user_roles").delete().eq("user_id", userId);
    if (userRoleError) {
      throw userRoleError;
    }

    const { error: profileError } = await supabaseAdmin.from("profiles").delete().eq("id", userId);
    if (profileError) {
      throw profileError;
    }

    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (authError) {
      throw authError;
    }

    return { success: true };
  },
);
