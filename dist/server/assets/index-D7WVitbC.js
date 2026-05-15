import { r as reactExports, W as jsxRuntimeExports } from "./server-BbznTnLG.js";
import { c as createLucideIcon, a as useAuth, u as useNavigate, L as Link, t as toast } from "./router-BN3FLmu3.js";
import { s as supabase } from "./client-551dqZwy.js";
import { B as Button } from "./button-BQozxjMi.js";
import { c as campus } from "./campus-DTeMj7zX.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
const __iconNode$4 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
];
const Image = createLucideIcon("image", __iconNode$4);
const __iconNode$3 = [
  ["path", { d: "M12 19v3", key: "npa21l" }],
  ["path", { d: "M19 10v2a7 7 0 0 1-14 0v-2", key: "1vc78b" }],
  ["rect", { x: "9", y: "2", width: "6", height: "13", rx: "3", key: "s6n7sd" }]
];
const Mic = createLucideIcon("mic", __iconNode$3);
const __iconNode$2 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }]
];
const Square = createLucideIcon("square", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",
      key: "ftymec"
    }
  ],
  ["rect", { x: "2", y: "6", width: "14", height: "12", rx: "2", key: "158x01" }]
];
const Video = createLucideIcon("video", __iconNode$1);
const __iconNode = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", __iconNode);
const COMPLAINT_OPTIONS = {
  Cleanliness: {
    issues: ["Garbage not collected", "Dirty washroom", "Spilled food", "Pest issue"],
    locations: ["Hostel - Block A", "Hostel - Block B", "Classroom", "Cafeteria", "Library", "Ground"]
  },
  Discipline: {
    issues: ["Bullying", "Smoking on campus", "Noise complaint", "Misbehaviour"],
    locations: ["Hostel - Block A", "Hostel - Block B", "Classroom", "Cafeteria", "Ground"]
  },
  Sports: {
    issues: ["Equipment damaged", "Field unusable", "Coach unavailable"],
    locations: ["Cricket Ground", "Football Ground", "Indoor Hall", "Gym"]
  },
  Event: {
    issues: ["Poor arrangement", "Schedule clash", "Sound system issue"],
    locations: ["Auditorium", "Open Ground", "Classroom"]
  },
  Subject: {
    issues: ["Teacher absent", "Syllabus issue", "Exam concern", "Notes unavailable"],
    locations: ["Department - CSE", "Department - ECE", "Department - Mech", "Department - Civil", "Department - MBA"]
  },
  WiFi: {
    issues: ["No connection", "Slow speed", "Frequent disconnect"],
    locations: ["Hostel - Block A", "Hostel - Block B", "Library", "Classroom", "Cafeteria"]
  },
  Other: {
    issues: ["Other"],
    locations: ["Campus - Other"]
  }
};
function Home() {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [category, setCategory] = reactExports.useState("");
  const [issue, setIssue] = reactExports.useState("");
  const [location, setLocation] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [anonymous, setAnonymous] = reactExports.useState(false);
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [attachments, setAttachments] = reactExports.useState([]);
  const [uploading, setUploading] = reactExports.useState(false);
  const [recording, setRecording] = reactExports.useState(false);
  const photoRef = reactExports.useRef(null);
  const videoRef = reactExports.useRef(null);
  const recorderRef = reactExports.useRef(null);
  const chunksRef = reactExports.useRef([]);
  const uploadFile = async (file, kind, ext) => {
    if (!user) {
      toast.error("Please log in first");
      return;
    }
    setUploading(true);
    const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const {
      error
    } = await supabase.storage.from("complaint-media").upload(path, file, {
      contentType: file.type
    });
    if (error) {
      setUploading(false);
      toast.error(error.message);
      return;
    }
    const {
      data
    } = supabase.storage.from("complaint-media").getPublicUrl(path);
    setAttachments((a) => [...a, {
      url: data.publicUrl,
      type: kind,
      path
    }]);
    setUploading(false);
    toast.success(`${kind} attached`);
  };
  const handleFilePick = (e, kind) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) return toast.error("File must be under 25MB");
    const ext = file.name.split(".").pop() || (kind === "image" ? "jpg" : "mp4");
    uploadFile(file, kind, ext);
  };
  const toggleRecord = async () => {
    if (recording) {
      recorderRef.current?.stop();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => chunksRef.current.push(e.data);
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: "audio/webm"
        });
        stream.getTracks().forEach((t) => t.stop());
        setRecording(false);
        uploadFile(blob, "audio", "webm");
      };
      rec.start();
      recorderRef.current = rec;
      setRecording(true);
    } catch {
      toast.error("Microphone access denied");
    }
  };
  const removeAttachment = async (idx) => {
    const a = attachments[idx];
    setAttachments((arr) => arr.filter((_, i) => i !== idx));
    await supabase.storage.from("complaint-media").remove([a.path]);
  };
  const issues = reactExports.useMemo(() => category ? COMPLAINT_OPTIONS[category]?.issues ?? [] : [], [category]);
  const locations = reactExports.useMemo(() => category ? COMPLAINT_OPTIONS[category]?.locations ?? [] : [], [category]);
  const scrollToForm = () => {
    document.getElementById("complaint-form")?.scrollIntoView({
      behavior: "smooth"
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to submit a complaint");
      navigate({
        to: "/login"
      });
      return;
    }
    if (!category || !issue || !location || description.trim().length < 5) {
      toast.error("Please fill all fields (description min 5 chars)");
      return;
    }
    setSubmitting(true);
    const {
      error
    } = await supabase.from("complaints").insert({
      user_id: user.id,
      category,
      issue,
      location,
      description: description.trim().slice(0, 1e3),
      anonymous,
      attachments: attachments.map(({
        url,
        type
      }) => ({
        url,
        type
      }))
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Complaint submitted!");
    setCategory("");
    setIssue("");
    setLocation("");
    setDescription("");
    setAnonymous(false);
    setAttachments([]);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative h-[60vh] min-h-[400px] w-full overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: campus, alt: "Campus aerial view", className: "absolute inset-0 w-full h-full object-cover" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative container mx-auto h-full flex items-center px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-xl rounded-xl bg-black/40 backdrop-blur-sm p-6 sm:p-8 text-white animate-in fade-in slide-in-from-left-4 duration-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl sm:text-5xl font-bold leading-tight", children: "Welcome to Campus Problem Solver" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-base sm:text-lg opacity-90", children: "Raise complaints easily and track them efficiently." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", className: "mt-5 rounded-full px-7", onClick: scrollToForm, children: "Write Complaint" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "complaint-form", className: "bg-muted/30 py-10 sm:py-14", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-3xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl sm:text-3xl font-bold mb-6 text-center", children: "Submit a Complaint" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5 bg-card p-6 sm:p-8 rounded-xl border shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold mb-1", children: "Choose problem regarding" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: category, onChange: (e) => {
            setCategory(e.target.value);
            setIssue("");
            setLocation("");
          }, className: "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "-- Choose an Option --" }),
            Object.keys(COMPLAINT_OPTIONS).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold mb-1", children: "Select specific issue" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: issue, onChange: (e) => setIssue(e.target.value), disabled: !category, className: "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-ring", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: category ? "-- Select an issue --" : "-- Select main category first --" }),
            issues.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: i, children: i }, i))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold mb-1", children: "Select Location" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: location, onChange: (e) => setLocation(e.target.value), disabled: !issue, className: "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-ring", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: issue ? "-- Select location --" : "-- Select issue first --" }),
            locations.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: l, children: l }, l))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold mb-1", children: "Describe your issue" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), rows: 4, maxLength: 1e3, placeholder: "Explain your issue clearly (location, problem, details)...", className: "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: anonymous, onChange: (e) => setAnonymous(e.target.checked) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Submit as Anonymous" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: photoRef, type: "file", accept: "image/*", hidden: true, onChange: (e) => handleFilePick(e, "image") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: videoRef, type: "file", accept: "video/*", hidden: true, onChange: (e) => handleFilePick(e, "video") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => photoRef.current?.click(), disabled: uploading || recording, className: "h-11 w-11 rounded-full border bg-background hover:bg-accent flex items-center justify-center transition-colors disabled:opacity-50", "aria-label": "Attach photo", title: "Attach photo", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => videoRef.current?.click(), disabled: uploading || recording, className: "h-11 w-11 rounded-full border bg-background hover:bg-accent flex items-center justify-center transition-colors disabled:opacity-50", "aria-label": "Attach video", title: "Attach video", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: toggleRecord, disabled: uploading, className: `h-11 w-11 rounded-full border flex items-center justify-center transition-colors disabled:opacity-50 ${recording ? "bg-destructive text-destructive-foreground border-destructive animate-pulse" : "bg-background hover:bg-accent"}`, "aria-label": recording ? "Stop recording" : "Record voice", title: recording ? "Stop recording" : "Record voice", children: recording ? /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "h-5 w-5" }) }),
            uploading && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Uploading…" })
          ] }),
          attachments.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2", children: attachments.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group rounded-md border overflow-hidden bg-muted aspect-square", children: [
            a.type === "image" && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: a.url, alt: "attachment", className: "w-full h-full object-cover" }),
            a.type === "video" && /* @__PURE__ */ jsxRuntimeExports.jsx("video", { src: a.url, className: "w-full h-full object-cover" }),
            a.type === "audio" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("audio", { src: a.url, controls: true, className: "w-full" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeAttachment(i), className: "absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }) })
          ] }, i)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: submitting, className: "w-full h-12 text-base", children: submitting ? "Submitting..." : "Submit Complaint" }),
        !user && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-sm text-muted-foreground", children: [
          "You'll need to ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-primary underline", children: "log in" }),
          " to submit."
        ] })
      ] })
    ] }) })
  ] });
}
export {
  Home as component
};
