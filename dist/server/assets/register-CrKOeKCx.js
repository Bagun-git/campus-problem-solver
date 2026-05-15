import { r as reactExports, W as jsxRuntimeExports } from "./server-BbznTnLG.js";
import { u as useNavigate, L as Link, t as toast } from "./router-BN3FLmu3.js";
import { s as supabase } from "./client-551dqZwy.js";
import { B as Button } from "./button-BQozxjMi.js";
import { L as Label, I as Input } from "./label-CG1Q2ihJ.js";
import { c as campus } from "./campus-DTeMj7zX.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [confirm, setConfirm] = reactExports.useState("");
  const [role, setRole] = reactExports.useState("student");
  const [department, setDepartment] = reactExports.useState("Cleanliness");
  const [loading, setLoading] = reactExports.useState(false);
  const DEPARTMENTS = ["Cleanliness", "Discipline", "Sports", "Event", "Subject", "Other"];
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (password !== confirm) return toast.error("Passwords don't match");
    setLoading(true);
    const {
      error
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          full_name: fullName,
          role,
          department: role === "faculty" ? department : null
        }
      }
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Check your email to verify your account!");
    navigate({
      to: "/login"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "container mx-auto px-4 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-6 items-stretch max-w-5xl mx-auto bg-card border rounded-2xl overflow-hidden shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 sm:p-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-extrabold tracking-tight", children: "REGISTER" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "mt-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Full Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name", required: true, value: fullName, onChange: (e) => setFullName(e.target.value), className: "mt-1 h-11 rounded-lg" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "mt-1 h-11 rounded-lg" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", children: "Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "password", type: "password", required: true, value: password, onChange: (e) => setPassword(e.target.value), className: "mt-1 h-11 rounded-lg" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "confirm", children: "Confirm Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "confirm", type: "password", required: true, value: confirm, onChange: (e) => setConfirm(e.target.value), className: "mt-1 h-11 rounded-lg" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "block mb-2", children: "Select Role" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ["student", "faculty"].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setRole(r), className: `px-4 py-2 rounded-lg border text-sm font-medium capitalize transition-colors ${role === r ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-accent"}`, children: r }, r)) })
        ] }),
        role === "faculty" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "department", className: "block mb-2", children: "Select Department" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { id: "department", value: department, onChange: (e) => setDepartment(e.target.value), className: "w-full h-11 rounded-lg border bg-background px-3 text-sm", required: true, children: DEPARTMENTS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: d, children: d }, d)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "You'll see and resolve complaints in this department." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: loading, className: "w-full h-11 text-base mt-2", children: loading ? "Creating..." : "Register" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-sm", children: [
          "Already have account? ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-primary font-semibold", children: "Login" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: campus, alt: "Campus", className: "h-full w-full object-cover" }) })
  ] }) });
}
export {
  RegisterPage as component
};
