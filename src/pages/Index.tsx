import { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "@/hooks/use-toast";
import flower1 from "@/assets/123.png";
import flower2 from "@/assets/124.png";
import bb from "@/assets/bb.gif";
import snow from "@/assets/snow.gif";
import wp from "@/assets/wp.png";

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
  const initialName = params.get("name") || "";
  const initialDate = params.get("date") || DEFAULT_TARGET;

  const [name, setName] = useState<string>(initialName);
  const [targetDate, setTargetDate] = useState<string>(initialDate);
  const [showEditor, setShowEditor] = useState<boolean>(!initialName);
  const countdown = useCountdown(targetDate);
  const cardRef = useRef<HTMLDivElement>(null);

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
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-foreground">Customize</h2>
              <button
                type="button"
                onClick={() => setShowEditor((v) => !v)}
                className="text-sm underline text-primary"
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
