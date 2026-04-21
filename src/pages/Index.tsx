import { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "@/hooks/use-toast";
import flower1 from "@/assets/123.png";
import flower2 from "@/assets/124.png";
import bb from "@/assets/bb.gif";
import snow from "@/assets/snow.gif";
import wp from "@/assets/wp.png";
import vandemataram from "@/assets/vandemataram.mp3";

const DEFAULT_TARGET = "2026-08-15T00:00:00";

const useCountdown = (targetISO: string) => {
  const [countdown, setCountdown] = useState("");
  useEffect(() => {
    const target = new Date(targetISO).getTime();
    const tick = () => {
      const distance = target - Date.now();
      if (distance < 0) {
        setCountdown("The day is here — Happy Independence Day!");
        return false;
      }
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setCountdown(`${days} Days · ${hours} Hrs · ${minutes} Min · ${seconds} Sec`);
      return true;
    };
    tick();
    const id = setInterval(() => {
      if (!tick()) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [targetISO]);
  return countdown;
};

const WishCard = ({
  name,
  countdown,
  cardRef,
  compact = false,
}: {
  name: string;
  countdown: string;
  cardRef?: React.Ref<HTMLDivElement>;
  compact?: boolean;
}) => (
  <div
    ref={cardRef}
    className="main-greeting mx-auto bg-[#1f2937] p-[5px] shadow-[3px_4px_41px_0_rgba(0,0,0,0.64)]"
    style={{ maxWidth: compact ? 320 : 420 }}
  >
    <div className="greeting-box overflow-hidden bg-white/85 rounded-[inherit] py-4">
      <p
        className="text-[#0f172a] font-extrabold px-2"
        style={{ fontSize: compact ? 14 : 18 }}
        aria-live="polite"
      >
        {countdown}
      </p>

      <figure className="wobble mt-2" aria-hidden="true" style={{ height: compact ? 60 : 90 }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <h1
            key={i}
            className="glow-h1 uppercase animate-fade-in"
            style={{
              transform: `translateZ(${i * 5}px)`,
              fontSize: compact ? 22 : 35,
            }}
          >
            {name || "Your Name"}
          </h1>
        ))}
      </figure>

      <div className="text-center mt-4 px-2">
        <img
          src={snow}
          alt=""
          aria-hidden="true"
          className="swing1 w-full"
          style={{ height: compact ? 60 : 100 }}
        />
        <h2 className="rock-h2" style={{ fontSize: compact ? 22 : 38 }}>
          <img
            src={bb}
            alt="Happy Independence Day banner"
            className="inline-block"
            style={{ width: "80%" }}
          />
        </h2>
        <h3 className="title-h3" style={{ fontSize: compact ? 22 : 36 }}>
          Happy Independence Day
        </h3>
        <p className="text-[#1e3a8a] font-semibold tracking-wide px-3 py-2">
          Wishing you a joyful Independence Day filled with pride and patriotism.
        </p>
        <p
          className="font-bold my-2 animate-scale-in"
          style={{ color: "hsl(var(--pink-accent))", fontSize: compact ? 18 : 24 }}
        >
          — {name || "Your Name"} —
        </p>
      </div>
    </div>
  </div>
);

const Index = () => {
  const params = useMemo(
    () => (typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams()),
    []
  );
  const initialName = params.get("name") || (typeof window !== "undefined" ? localStorage.getItem("idw:name") || "" : "");
  const initialDate = params.get("date") || (typeof window !== "undefined" ? localStorage.getItem("idw:date") || DEFAULT_TARGET : DEFAULT_TARGET);

  const [name, setName] = useState<string>(initialName);
  const [targetDate, setTargetDate] = useState<string>(initialDate);
  const [showEditor, setShowEditor] = useState<boolean>(!initialName);
  const [audioStatus, setAudioStatus] = useState<string>("");

  // Persist edits to localStorage
  useEffect(() => {
    try { localStorage.setItem("idw:name", name); } catch {}
  }, [name]);
  useEffect(() => {
    try { localStorage.setItem("idw:date", targetDate); } catch {}
  }, [targetDate]);

  const resetDefaults = () => {
    setName("");
    setTargetDate(DEFAULT_TARGET);
    setVolume(0.6);
    setIsMuted(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    try {
      localStorage.removeItem("idw:name");
      localStorage.removeItem("idw:date");
    } catch {}
    toast({ title: "Reset", description: "Title, countdown, and music restored to defaults." });
  };
  const countdown = useCountdown(targetDate);
  const cardRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [isMuted, setIsMuted] = useState(false);
  const prevVolumeRef = useRef(0.6);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const toggleMute = () => {
    setIsMuted((m) => {
      const next = !m;
      if (next) {
        prevVolumeRef.current = volume;
      } else if (volume === 0) {
        setVolume(prevVolumeRef.current || 0.6);
      }
      setAudioStatus(next ? "Music muted" : "Music unmuted");
      return next;
    });
  };

  // Keyboard shortcuts: M = mute toggle, Space (when not in input) = play/pause, ↑/↓ = volume
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isField = tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable;
      if (isField) return;
      if (e.key.toLowerCase() === "m") {
        e.preventDefault();
        toggleMute();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setVolume((v) => Math.min(1, +(v + 0.05).toFixed(2)));
        setIsMuted(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setVolume((v) => Math.max(0, +(v - 0.05).toFixed(2)));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume]);

  const toggleAudio = async () => {
    if (!audioRef.current) return;
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        setAudioStatus("Music paused");
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
        setAudioStatus("Music playing: Vande Mataram");
      }
    } catch (e) {
      toast({ title: "Playback failed", description: String(e), variant: "destructive" });
    }
  };

  // Prompt only if no name in URL and editor is dismissed without entering one
  useEffect(() => {
    if (initialName) return;
    // Editor open by default, no prompt needed
  }, [initialName]);

  const exportAs = async (kind: "png" | "pdf") => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });
      if (kind === "png") {
        const link = document.createElement("a");
        link.download = `independence-day-${name || "wish"}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } else {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "px",
          format: [canvas.width, canvas.height],
        });
        pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
        pdf.save(`independence-day-${name || "wish"}.pdf`);
      }
      toast({ title: "Exported", description: `Your wish was saved as ${kind.toUpperCase()}.` });
    } catch (e) {
      toast({ title: "Export failed", description: String(e), variant: "destructive" });
    }
  };

  const copyShareLink = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("name", name || "Friend");
    url.searchParams.set("date", targetDate);
    try {
      await navigator.clipboard.writeText(url.toString());
      toast({ title: "Link copied", description: "Share it anywhere — it preloads the name & countdown." });
    } catch {
      window.prompt("Copy this link:", url.toString());
    }
  };

  return (
    <div className="snow-body min-h-screen relative overflow-hidden">
      {/* Tricolor radial glow */}
      <div className="tricolor-glow" aria-hidden="true" />

      {/* Bokeh orbs */}
      <div className="bokeh-layer" aria-hidden="true">
        {[
          { c: "bokeh-saffron", size: 280, top: "8%",  left: "10%", dur: 9,  alt: false },
          { c: "bokeh-white",   size: 220, top: "20%", left: "75%", dur: 11, alt: true  },
          { c: "bokeh-green",   size: 320, top: "65%", left: "15%", dur: 13, alt: false },
          { c: "bokeh-blue",    size: 200, top: "75%", left: "70%", dur: 10, alt: true  },
          { c: "bokeh-saffron", size: 160, top: "45%", left: "50%", dur: 12, alt: true  },
          { c: "bokeh-green",   size: 180, top: "5%",  left: "55%", dur: 14, alt: false },
          { c: "bokeh-white",   size: 140, top: "55%", left: "85%", dur: 9,  alt: true  },
        ].map((b, i) => (
          <span
            key={i}
            className={`bokeh ${b.c}`}
            style={{
              width: b.size, height: b.size,
              top: b.top, left: b.left,
              animation: `${b.alt ? "float-bokeh-alt" : "float-bokeh"} ${b.dur}s ease-in-out infinite`,
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}
        {/* Sparkles */}
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={`sp-${i}`}
            className="sparkle"
            style={{
              left: `${(i * 5.5) % 100}%`,
              bottom: `-${Math.random() * 20}px`,
              animationDuration: `${8 + (i % 6) * 1.5}s`,
              animationDelay: `${(i * 0.6) % 8}s`,
              boxShadow: i % 3 === 0
                ? "0 0 10px 2px hsl(var(--saffron) / 0.9)"
                : i % 3 === 1
                ? "0 0 10px 2px hsl(var(--india-green) / 0.9)"
                : "0 0 10px 2px rgba(255,255,255,0.95)",
            }}
          />
        ))}
      </div>

      <audio ref={audioRef} src={vandemataram} loop preload="auto" aria-label="Vande Mataram instrumental" />

      {/* Music control panel */}
      <div
        className="music-panel fixed top-4 right-4 z-30 flex items-center gap-3 rounded-full px-4 py-2 shadow-lg"
        role="group"
        aria-label="Background music controls (M to mute, Space to play, Arrow Up/Down for volume)"
      >
        <button
          type="button"
          onClick={toggleAudio}
          className="flex items-center gap-2 font-semibold text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full"
          aria-label={isPlaying ? "Pause Vande Mataram background music" : "Play Vande Mataram background music"}
          aria-pressed={isPlaying}
        >
          <span aria-hidden="true" className="text-base">{isPlaying ? "⏸" : "▶"}</span>
          <span className="hidden sm:inline">{isPlaying ? "Pause" : "Vande Mataram"}</span>
        </button>
        <button
          type="button"
          onClick={toggleMute}
          className="text-white text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full px-1"
          aria-label={isMuted ? "Unmute background music (M)" : "Mute background music (M)"}
          aria-pressed={isMuted}
          title="Mute (M)"
        >
          <span aria-hidden="true">{isMuted || volume === 0 ? "🔇" : "🔉"}</span>
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            setVolume(v);
            if (v > 0 && isMuted) setIsMuted(false);
          }}
          className="volume-slider w-20"
          aria-label="Background music volume"
          aria-valuemin={0}
          aria-valuemax={1}
          aria-valuenow={isMuted ? 0 : volume}
        />
      </div>

      {/* Decorative side marquees */}
      <div className="marquee-col marquee-col-left" aria-hidden="true">
        <div className="marquee-track marquee-up">
          {Array.from({ length: 20 }).map((_, i) => (
            <img
              key={`l-${i}`}
              src={i % 2 === 0 ? flower1 : flower2}
              alt=""
              className="mx-auto my-2"
              style={{ width: 35, height: 129 }}
            />
          ))}
        </div>
      </div>
      <div className="marquee-col marquee-col-right" aria-hidden="true">
        <div className="marquee-track marquee-down">
          {Array.from({ length: 20 }).map((_, i) => (
            <img
              key={`r-${i}`}
              src={i % 2 === 0 ? flower1 : flower2}
              alt=""
              className="mx-auto my-2"
              style={{ width: 35, height: 129 }}
            />
          ))}
        </div>
      </div>

      <main className="container mx-auto px-4 pt-6 pb-32 relative z-10">
        <h1 className="sr-only">Personalised Happy Independence Day Wish</h1>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
          {/* Main wish */}
          <section aria-label="Your personalised wish card">
            <WishCard name={name} countdown={countdown} cardRef={cardRef} />

            <div className="mx-auto max-w-[420px] mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => exportAs("png")}
                className="action-btn action-btn-primary"
                aria-label="Download wish as PNG image"
              >
                ⬇ Save as Image
              </button>
              <button
                type="button"
                onClick={() => exportAs("pdf")}
                className="action-btn action-btn-secondary"
                aria-label="Download wish as PDF document"
              >
                ⬇ Save as PDF
              </button>
              <button
                type="button"
                onClick={copyShareLink}
                className="action-btn action-btn-accent col-span-2"
                aria-label="Copy shareable link with your name and countdown preloaded"
              >
                🔗 Copy Shareable Link
              </button>
            </div>
          </section>

          {/* Editor + live preview */}
          <aside
            className="editor-panel rounded-xl p-5 backdrop-blur"
            aria-label="Wish editor and live preview"
          >
            <div className="flex items-center justify-between mb-4 pt-1">
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className="text-xl">🇮🇳</span>
                <h2 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-[hsl(var(--saffron))] via-[hsl(var(--india-blue))] to-[hsl(var(--india-green))] bg-clip-text text-transparent">
                  Customize Your Wish
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowEditor((v) => !v)}
                className="text-xs font-semibold px-2 py-1 rounded-md border border-border hover:bg-accent text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-expanded={showEditor}
                aria-controls="editor-fields"
              >
                {showEditor ? "Hide" : "Show"}
              </button>
            </div>

            {showEditor && (
              <div id="editor-fields" className="space-y-4">
                <div>
                  <label htmlFor="name-input" className="block text-sm font-semibold text-foreground mb-1">
                    Your name
                  </label>
                  <input
                    id="name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    aria-label="Enter the name to display on the wish"
                  />
                </div>

                <div>
                  <label htmlFor="date-input" className="block text-sm font-semibold text-foreground mb-1">
                    Countdown to
                  </label>
                  <input
                    id="date-input"
                    type="datetime-local"
                    value={targetDate.slice(0, 16)}
                    onChange={(e) => setTargetDate(e.target.value + ":00")}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    aria-label="Choose the target date for the countdown"
                  />
                </div>

                <div>
                  <p className="block text-sm font-semibold text-foreground mb-2">Live preview</p>
                  <div className="rounded-lg p-3 bg-secondary/60 border border-border overflow-hidden">
                    <WishCard name={name} countdown={countdown} compact />
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>

      {/* Bottom share bar */}
      <nav
        className="share-box fixed left-0 right-0 bottom-0 flex z-20"
        aria-label="Share this wish"
      >
        <a
          href={`https://wa.me/?text=${encodeURIComponent(
            `Happy Independence Day from ${name || "Friend"}! ${typeof window !== "undefined" ? window.location.href : ""}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-btn whatsapp flex-1 flex items-center justify-center gap-2"
          aria-label="Share on WhatsApp"
        >
          <img src={wp} alt="" aria-hidden="true" className="h-5 w-5" /> WhatsApp
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            typeof window !== "undefined" ? window.location.href : ""
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-btn facebook flex-1 flex items-center justify-center"
          aria-label="Share on Facebook"
        >
          Facebook
        </a>
        <button
          type="button"
          onClick={() => {
            const n = window.prompt("Please Enter Your Name", name) || name || "Friend";
            setName(n);
          }}
          className="share-btn download flex-1"
          aria-label="Create a new wish with a different name"
        >
          New Wish
        </button>
      </nav>
    </div>
  );
};

export default Index;
