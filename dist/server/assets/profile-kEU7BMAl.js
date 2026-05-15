import { O as useRouter, r as reactExports, b as isRedirect, a2 as TSS_SERVER_FUNCTION, a4 as getServerFnById, a3 as createServerFn, W as jsxRuntimeExports } from "./server-BbznTnLG.js";
import { a as useAuth, u as useNavigate, N as Navigate, U as User, t as toast } from "./router-BN3FLmu3.js";
import { s as supabase } from "./client-551dqZwy.js";
import { B as Button } from "./button-BQozxjMi.js";
import { L as Label, I as Input } from "./label-CG1Q2ihJ.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
function useServerFn(serverFn) {
  const router = useRouter();
  return reactExports.useCallback(async (...args) => {
    try {
      const res = await serverFn(...args);
      if (isRedirect(res)) throw res;
      return res;
    } catch (err) {
      if (isRedirect(err)) {
        err.options._fromLocation = router.stores.location.get();
        return router.navigate(router.resolveRedirect(err).options);
      }
      throw err;
    }
  }, [router, serverFn]);
}
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const deleteMyAccount = createServerFn({
  method: "POST"
}).handler(createSsrRpc("27301031363e284184ead21ac910c33ebfbe9159435c975f26319c6a65fade88"));
function ProfilePage() {
  const {
    user,
    loading,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const callDeleteAccount = useServerFn(deleteMyAccount);
  const [profile, setProfile] = reactExports.useState(null);
  const [fullName, setFullName] = reactExports.useState("");
  const [stats, setStats] = reactExports.useState({
    total: 0,
    pending: 0,
    resolved: 0
  });
  const [busy, setBusy] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  const [newPw, setNewPw] = reactExports.useState("");
  const [confirmPw, setConfirmPw] = reactExports.useState("");
  const [pwSaving, setPwSaving] = reactExports.useState(false);
  const [showPw, setShowPw] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!user) return;
    (async () => {
      const [{
        data: p
      }, {
        data: c
      }] = await Promise.all([supabase.from("profiles").select("full_name,email,role").eq("id", user.id).maybeSingle(), supabase.from("complaints").select("status").eq("user_id", user.id)]);
      setProfile(p);
      setFullName(p?.full_name ?? "");
      const list = c ?? [];
      setStats({
        total: list.length,
        pending: list.filter((x) => x.status !== "resolved").length,
        resolved: list.filter((x) => x.status === "resolved").length
      });
      setBusy(false);
    })();
  }, [user]);
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto p-10 text-center", children: "Loading..." });
  if (!user) return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login" });
  const handleSave = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) return toast.error("Name cannot be empty");
    setSaving(true);
    const {
      error
    } = await supabase.from("profiles").update({
      full_name: fullName.trim()
    }).eq("id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    setProfile((p) => p ? {
      ...p,
      full_name: fullName.trim()
    } : p);
    toast.success("Profile updated");
  };
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPw.length < 6) return toast.error("Password must be at least 6 characters");
    if (newPw !== confirmPw) return toast.error("Passwords do not match");
    setPwSaving(true);
    const {
      error
    } = await supabase.auth.updateUser({
      password: newPw
    });
    setPwSaving(false);
    if (error) return toast.error(error.message);
    setNewPw("");
    setConfirmPw("");
    toast.success("Password updated");
  };
  const handleDeleteAccount = async () => {
    if (!confirm("Permanently delete your account and all data? This cannot be undone.")) return;
    try {
      await callDeleteAccount({
        userId: user?.id
      });
      await signOut();
      toast.success("Account deleted");
      navigate({
        to: "/"
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete account");
    }
  };
  const initials = (profile?.full_name || profile?.email || "U").split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "container mx-auto px-4 py-10 max-w-5xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl sm:text-4xl font-bold", children: "My Profile" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Your account details and activity" })
    ] }),
    busy ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-sm text-muted-foreground", children: "Loading..." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "bg-accent/40 rounded-xl border p-6 text-center md:col-span-1 h-fit", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-24 w-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-3xl font-bold", children: initials || /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-10 w-10" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-bold", children: profile?.full_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground truncate", children: profile?.email }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block mt-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold capitalize", children: profile?.role }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "mt-6 grid grid-cols-3 gap-2 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg p-3 border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-xs text-muted-foreground", children: "Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "text-lg font-bold", children: stats.total })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg p-3 border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-xs text-muted-foreground", children: "Pending" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "text-lg font-bold text-yellow-600", children: stats.pending })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg p-3 border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-xs text-muted-foreground", children: "Resolved" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "text-lg font-bold text-green-600", children: stats.resolved })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-accent/40 rounded-xl border p-6 md:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-bold text-lg mb-4", children: "Edit Details" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSave, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "full_name", children: "Full Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "full_name", value: fullName, onChange: (e) => setFullName(e.target.value), className: "mt-1 h-11 rounded-lg" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", value: profile?.email ?? "", disabled: true, className: "mt-1 h-11 rounded-lg bg-muted" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Email cannot be changed." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "role", children: "Role" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "role", value: profile?.role ?? "", disabled: true, className: "mt-1 h-11 rounded-lg bg-muted capitalize" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: saving, className: "h-11 px-6", children: saving ? "Saving..." : "Save Changes" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 pt-6 border-t", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setShowPw((v) => !v), className: "font-bold text-lg flex items-center gap-2 hover:text-primary transition-colors", children: [
            "Change Password",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: showPw ? "▲" : "▼" })
          ] }),
          showPw && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleChangePassword, className: "space-y-4 mt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "new_pw", children: "New Password" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "new_pw", type: "password", value: newPw, onChange: (e) => setNewPw(e.target.value), className: "mt-1 h-11 rounded-lg" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "confirm_pw", children: "Confirm Password" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "confirm_pw", type: "password", value: confirmPw, onChange: (e) => setConfirmPw(e.target.value), className: "mt-1 h-11 rounded-lg" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: pwSaving, variant: "secondary", className: "h-11 px-6", children: pwSaving ? "Updating..." : "Update Password" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 pt-6 border-t", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", onClick: handleDeleteAccount, children: "Delete my account" }) })
      ] })
    ] })
  ] });
}
export {
  ProfilePage as component
};
