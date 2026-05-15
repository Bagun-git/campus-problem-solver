import { r as reactExports, W as jsxRuntimeExports } from "./server-BbznTnLG.js";
import { a as useAuth, N as Navigate, t as toast } from "./router-BN3FLmu3.js";
import { s as supabase } from "./client-551dqZwy.js";
import { B as Button } from "./button-BQozxjMi.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
function AdminPage() {
  const {
    user,
    isAdmin,
    loading
  } = useAuth();
  const [rows, setRows] = reactExports.useState([]);
  const [busy, setBusy] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (!user || !isAdmin) return;
    supabase.from("complaints").select("*").order("created_at", {
      ascending: false
    }).then(({
      data
    }) => {
      setRows(data ?? []);
      setBusy(false);
    });
  }, [user, isAdmin]);
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-center", children: "Loading..." });
  if (!user) return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login" });
  if (!isAdmin) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto p-10 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Access denied" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2", children: "You need admin privileges to view this page." })
  ] });
  const setStatus = async (id, status) => {
    const {
      error
    } = await supabase.from("complaints").update({
      status
    }).eq("id", id);
    if (error) return toast.error(error.message);
    setRows((p) => p.map((r) => r.id === id ? {
      ...r,
      status
    } : r));
    toast.success(`Marked ${status}`);
  };
  const remove = async (id) => {
    if (!confirm("Delete?")) return;
    const {
      error
    } = await supabase.from("complaints").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setRows((p) => p.filter((r) => r.id !== id));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "container mx-auto px-4 py-10 max-w-6xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold mb-2", children: "Admin Dashboard" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: "All complaints across the campus." }),
    busy ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Loading..." }) : rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No complaints yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "border rounded-lg p-4 bg-card text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-between gap-2 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: r.category }),
          " · ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: r.issue }),
          " · ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: r.location })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 rounded text-xs font-semibold ${r.status === "resolved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`, children: r.status })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: r.description }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-2", children: [
        r.anonymous ? "Anonymous" : `User: ${r.user_id.slice(0, 8)}…`,
        " · ",
        new Date(r.created_at).toLocaleString()
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => setStatus(r.id, r.status === "resolved" ? "pending" : "resolved"), children: [
          "Mark as ",
          r.status === "resolved" ? "Pending" : "Resolved"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "destructive", onClick: () => remove(r.id), children: "Delete" })
      ] })
    ] }, r.id)) })
  ] });
}
export {
  AdminPage as component
};
