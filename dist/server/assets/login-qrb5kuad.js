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
function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const {
      error
    } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    setLoading(false);
    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        toast.error("Please verify your email first. Check your inbox.");
      } else {
        toast.error(error.message);
      }
      return;
    }
    toast.success("Welcome back!");
    navigate({
      to: "/dashboard"
    });
  };
  const handleForgot = async () => {
    if (!email) return toast.error("Enter your email above first");
    const {
      error
    } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) return toast.error(error.message);
    toast.success("Password reset email sent. Check your inbox.");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "container mx-auto px-4 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-6 items-stretch max-w-5xl mx-auto bg-card border rounded-2xl overflow-hidden shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 sm:p-10 flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-extrabold tracking-tight", children: "LOGIN" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "mt-6 space-y-4 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "mt-1 h-11 rounded-lg" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", children: "Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "password", type: "password", required: true, value: password, onChange: (e) => setPassword(e.target.value), className: "mt-1 h-11 rounded-lg" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: loading, className: "w-full h-11 text-base", children: loading ? "Logging in..." : "Login" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: handleForgot, className: "block text-center text-sm mt-3 text-primary hover:underline w-full", children: "Forgot password?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-sm mt-4", children: [
            "Don't have account? ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/register", className: "text-primary font-semibold", children: "Register" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: campus, alt: "Campus", className: "h-full w-full object-cover" }) })
  ] }) });
}
export {
  LoginPage as component
};
