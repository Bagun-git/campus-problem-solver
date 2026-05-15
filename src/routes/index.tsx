import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { COMPLAINT_OPTIONS } from "@/lib/complaint-options";
import { Button } from "@/components/ui/button";
import { ImageIcon, Video, Mic, X, Square } from "lucide-react";
import campus from "@/assets/campus.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [issue, setIssue] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<{ url: string; type: "image" | "video" | "audio"; path: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [recording, setRecording] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const uploadFile = async (file: Blob, kind: "image" | "video" | "audio", ext: string) => {
    if (!user) { toast.error("Please log in first"); return; }
    setUploading(true);
    const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("complaint-media").upload(path, file, { contentType: file.type });
    if (error) { setUploading(false); toast.error(error.message); return; }
    const { data } = supabase.storage.from("complaint-media").getPublicUrl(path);
    setAttachments((a) => [...a, { url: data.publicUrl, type: kind, path }]);
    setUploading(false);
    toast.success(`${kind} attached`);
  };

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>, kind: "image" | "video") => {
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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => chunksRef.current.push(e.data);
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
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

  const removeAttachment = async (idx: number) => {
    const a = attachments[idx];
    setAttachments((arr) => arr.filter((_, i) => i !== idx));
    await supabase.storage.from("complaint-media").remove([a.path]);
  };

  const issues = useMemo(() => (category ? COMPLAINT_OPTIONS[category]?.issues ?? [] : []), [category]);
  const locations = useMemo(() => (category ? COMPLAINT_OPTIONS[category]?.locations ?? [] : []), [category]);

  const scrollToForm = () => {
    document.getElementById("complaint-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to submit a complaint");
      navigate({ to: "/login" });
      return;
    }
    if (!category || !issue || !location || description.trim().length < 5) {
      toast.error("Please fill all fields (description min 5 chars)");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("complaints").insert({
      user_id: user.id,
      category,
      issue,
      location,
      description: description.trim().slice(0, 1000),
      anonymous,
      attachments: attachments.map(({ url, type }) => ({ url, type })),
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Complaint submitted!");
    setCategory(""); setIssue(""); setLocation(""); setDescription(""); setAnonymous(false); setAttachments([]);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <img src={campus} alt="Campus aerial view" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="relative container mx-auto h-full flex items-center px-4">
          <div className="max-w-xl rounded-xl bg-black/40 backdrop-blur-sm p-6 sm:p-8 text-white animate-in fade-in slide-in-from-left-4 duration-700">
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight">Welcome to Campus Problem Solver</h1>
            <p className="mt-3 text-base sm:text-lg opacity-90">Raise complaints easily and track them efficiently.</p>
            <Button size="lg" className="mt-5 rounded-full px-7" onClick={scrollToForm}>
              Write Complaint
            </Button>
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="complaint-form" className="bg-muted/30 py-10 sm:py-14">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Submit a Complaint</h2>
          <form onSubmit={handleSubmit} className="space-y-5 bg-card p-6 sm:p-8 rounded-xl border shadow-sm">
            <div>
              <label className="block text-sm font-semibold mb-1">Choose problem regarding</label>
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setIssue(""); setLocation(""); }}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">-- Choose an Option --</option>
                {Object.keys(COMPLAINT_OPTIONS).map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Select specific issue</label>
              <select
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                disabled={!category}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">{category ? "-- Select an issue --" : "-- Select main category first --"}</option>
                {issues.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Select Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={!issue}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">{issue ? "-- Select location --" : "-- Select issue first --"}</option>
                {locations.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Describe your issue</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                maxLength={1000}
                placeholder="Explain your issue clearly (location, problem, details)..."
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
              <span>Submit as Anonymous</span>
            </label>
            <div>
              <div className="flex items-center gap-3">
                <input ref={photoRef} type="file" accept="image/*" hidden onChange={(e) => handleFilePick(e, "image")} />
                <input ref={videoRef} type="file" accept="video/*" hidden onChange={(e) => handleFilePick(e, "video")} />
                <button type="button" onClick={() => photoRef.current?.click()} disabled={uploading || recording}
                  className="h-11 w-11 rounded-full border bg-background hover:bg-accent flex items-center justify-center transition-colors disabled:opacity-50"
                  aria-label="Attach photo" title="Attach photo">
                  <ImageIcon className="h-5 w-5" />
                </button>
                <button type="button" onClick={() => videoRef.current?.click()} disabled={uploading || recording}
                  className="h-11 w-11 rounded-full border bg-background hover:bg-accent flex items-center justify-center transition-colors disabled:opacity-50"
                  aria-label="Attach video" title="Attach video">
                  <Video className="h-5 w-5" />
                </button>
                <button type="button" onClick={toggleRecord} disabled={uploading}
                  className={`h-11 w-11 rounded-full border flex items-center justify-center transition-colors disabled:opacity-50 ${recording ? "bg-destructive text-destructive-foreground border-destructive animate-pulse" : "bg-background hover:bg-accent"}`}
                  aria-label={recording ? "Stop recording" : "Record voice"} title={recording ? "Stop recording" : "Record voice"}>
                  {recording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
                {uploading && <span className="text-xs text-muted-foreground">Uploading…</span>}
              </div>
              {attachments.length > 0 && (
                <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {attachments.map((a, i) => (
                    <div key={i} className="relative group rounded-md border overflow-hidden bg-muted aspect-square">
                      {a.type === "image" && <img src={a.url} alt="attachment" className="w-full h-full object-cover" />}
                      {a.type === "video" && <video src={a.url} className="w-full h-full object-cover" />}
                      {a.type === "audio" && (
                        <div className="w-full h-full flex items-center justify-center p-1">
                          <audio src={a.url} controls className="w-full" />
                        </div>
                      )}
                      <button type="button" onClick={() => removeAttachment(i)}
                        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button type="submit" disabled={submitting} className="w-full h-12 text-base">
              {submitting ? "Submitting..." : "Submit Complaint"}
            </Button>
            {!user && (
              <p className="text-center text-sm text-muted-foreground">
                You'll need to <Link to="/login" className="text-primary underline">log in</Link> to submit.
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}