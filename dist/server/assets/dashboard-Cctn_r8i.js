import { r as reactExports, W as jsxRuntimeExports } from "./server-BbznTnLG.js";
import { a as useAuth, N as Navigate, t as toast } from "./router-BN3FLmu3.js";
import { s as supabase } from "./client-551dqZwy.js";
import { B as Button } from "./button-BQozxjMi.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
function DashboardPage() {
  const {
    user,
    loading
  } = useAuth();
  const [profile, setProfile] = reactExports.useState(null);
  const [complaints, setComplaints] = reactExports.useState([]);
  const [reporters, setReporters] = reactExports.useState({});
  const [busy, setBusy] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (!user) return;
    (async () => {
      const {
        data: p
      } = await supabase.from("profiles").select("full_name,email,role,department").eq("id", user.id).maybeSingle();
      const prof = p;
      setProfile(prof);
      let query = supabase.from("complaints").select("*").order("created_at", {
        ascending: false
      });
      if (prof?.role === "faculty" && prof.department) {
        query = query.eq("category", prof.department);
      } else {
        query = query.eq("user_id", user.id);
      }
      const {
        data: c
      } = await query;
      const list = c ?? [];
      setComplaints(list);
      if (prof?.role === "faculty") {
        const ids = Array.from(new Set(list.filter((x) => !x.anonymous).map((x) => x.user_id)));
        if (ids.length) {
          const {
            data: profs
          } = await supabase.from("profiles").select("id,full_name").in("id", ids);
          const map = {};
          (profs ?? []).forEach((r) => {
            map[r.id] = r.full_name;
          });
          setReporters(map);
        }
      }
      setBusy(false);
    })();
  }, [user]);
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto p-10 text-center", children: "Loading..." });
  if (!user) return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login" });
  const isFaculty = profile?.role === "faculty";
  const toggleStatus = async (c) => {
    const newStatus = c.status === "resolved" ? "pending" : "resolved";
    const {
      error
    } = await supabase.from("complaints").update({
      status: newStatus
    }).eq("id", c.id);
    if (error) return toast.error(error.message);
    setComplaints((prev) => prev.map((x) => x.id === c.id ? {
      ...x,
      status: newStatus
    } : x));
    toast.success(`Marked as ${newStatus}`);
  };
  const removeComplaint = async (id) => {
    if (!confirm("Delete this complaint?")) return;
    const {
      error
    } = await supabase.from("complaints").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setComplaints((prev) => prev.filter((x) => x.id !== id));
    toast.success("Deleted");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "container mx-auto px-4 py-10 max-w-6xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl sm:text-4xl font-bold", children: "Dashboard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: isFaculty ? `Complaints in your department: ${profile?.department ?? "—"}` : "Manage your profile and complaints" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "bg-accent/40 rounded-xl border p-6 md:col-span-1 h-fit", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-bold text-lg mb-4", children: "Your Profile" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "space-y-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "font-semibold", children: "Name:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: profile?.full_name ?? "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "font-semibold", children: "Email:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "truncate", children: profile?.email ?? "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "font-semibold", children: "Role:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "capitalize", children: profile?.role ?? "—" })
          ] }),
          isFaculty && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "font-semibold", children: "Dept:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: profile?.department ?? "—" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-accent/40 rounded-xl border p-6 md:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-bold text-lg mb-4", children: isFaculty ? "Department Complaints" : "Your Complaints" }),
        busy ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading..." }) : complaints.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No complaints yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 max-h-[600px] overflow-y-auto pr-2", children: complaints.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "border-l-4 border-primary bg-card rounded-lg p-4 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Category:" }),
            " ",
            c.category
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Issue:" }),
            " ",
            c.issue
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Location:" }),
            " ",
            c.location
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Description:" }),
            " ",
            c.description
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "By:" }),
            " ",
            c.anonymous ? "Anonymous" : isFaculty ? reporters[c.user_id] ?? "Student" : profile?.full_name
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Status:" }),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2 py-0.5 rounded text-xs font-semibold ${c.status === "resolved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`, children: c.status })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => toggleStatus(c), children: [
              "Mark as ",
              c.status === "resolved" ? "Pending" : "Resolved"
            ] }),
            !isFaculty && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "destructive", onClick: () => removeComplaint(c.id), children: "Delete" })
          ] })
        ] }, c.id)) })
      ] })
    ] })
  ] });
}
export {
  DashboardPage as component
};
