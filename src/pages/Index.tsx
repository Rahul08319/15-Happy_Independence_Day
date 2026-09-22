import React, { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Download,
  FileText,
  Share2,
  Copy,
  Check,
  RotateCcw,
  QrCode,
  Calendar,
  User,
  Palette,
  Flag,
  Type,
  Users,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import AshokaChakra from "@/components/AshokaChakra";
import MusicPlayer from "@/components/MusicPlayer";
import QRCodeModal from "@/components/QRCodeModal";
import CelebrationCanvas from "@/components/CelebrationCanvas";
import { PATRIOTIC_QUOTES } from "@/components/patrioticQuotes";
import { getIndependenceDayInfo } from "@/lib/independenceDay";
import vandemataram from "@/assets/vandemataram.mp3";

const TRICOLORS = ["#FF671F", "#FFFFFF", "#046A38", "#06038D", "#D4AF37"];

const fireCelebrationConfetti = () => {
  if (typeof window === "undefined") return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  const defaults = { colors: TRICOLORS, zIndex: 9999, disableForReducedMotion: true };
  confetti({ ...defaults, particleCount: 65, spread: 65, origin: { x: 0.15, y: 0.8 }, angle: 55 });
  confetti({ ...defaults, particleCount: 65, spread: 65, origin: { x: 0.85, y: 0.8 }, angle: 125 });

  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 120,
      spread: 120,
      startVelocity: 50,
      origin: { x: 0.5, y: 0.55 },
    });
  }, 220);
};

type CardTheme = "midnight" | "saffron" | "tiranga" | "emerald";
type CardFontStyle = "regal" | "serif" | "traditional" | "modern";

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

const useCountdown = (targetISO: string): CountdownTime => {
  const [time, setTime] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false,
  });

  useEffect(() => {
    const target = new Date(targetISO).getTime();
    const tick = () => {
      const distance = target - Date.now();
      if (distance <= 0) {
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true });
        return false;
      }
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setTime({ days, hours, minutes, seconds, isComplete: false });
      return true;
    };

    tick();
    const id = setInterval(() => {
      if (!tick()) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [targetISO]);

  return time;
};

// Main Greeting Card Component with 3D Interactive Tilt & Dynamic Milestones
const WishCard = ({
  senderName,
  recipientName,
  title,
  message,
  author,
  countdown,
  theme,
  fontStyle,
  targetYear,
  ordinalEdition,
  cardRef,
  compact = false,
}: {
  senderName: string;
  recipientName: string;
  title: string;
  message: string;
  author: string;
  countdown: CountdownTime;
  theme: CardTheme;
  fontStyle: CardFontStyle;
  targetYear: number;
  ordinalEdition: string;
  cardRef?: React.Ref<HTMLDivElement>;
  compact?: boolean;
}) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [sheen, setSheen] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (compact) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = -((y - centerY) / centerY) * 7;
    const rotateY = ((x - centerX) / centerX) * 7;
    setRotate({ x: rotateX, y: rotateY });
    setSheen({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.16,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setSheen({ x: 50, y: 50, opacity: 0 });
  };

  const themeStyles = {
    midnight: {
      bg: "linear-gradient(165deg, #0b1329 0%, #060913 50%, #0d1b3e 100%)",
      border: "rgba(212, 175, 55, 0.45)",
      badgeBg: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    },
    saffron: {
      bg: "linear-gradient(165deg, #2b1104 0%, #150802 50%, #3d1704 100%)",
      border: "rgba(255, 103, 31, 0.5)",
      badgeBg: "bg-orange-500/15 text-orange-300 border-orange-500/30",
    },
    tiranga: {
      bg: "linear-gradient(165deg, #131d2e 0%, #0a111c 50%, #0c231a 100%)",
      border: "rgba(255, 255, 255, 0.35)",
      badgeBg: "bg-white/10 text-white border-white/20",
    },
    emerald: {
      bg: "linear-gradient(165deg, #062419 0%, #03140e 50%, #083424 100%)",
      border: "rgba(4, 106, 56, 0.6)",
      badgeBg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    },
  }[theme];

  const fontClasses = {
    regal: "font-['Cinzel_Decorative',serif]",
    serif: "font-['Playfair_Display',serif]",
    traditional: "font-['Rozha_One',serif]",
    modern: "font-sans",
  }[fontStyle];

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto rounded-[1.75rem] p-[2px] cursor-pointer select-none transition-transform duration-150 ease-out shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)]"
      style={{
        maxWidth: compact ? 340 : 480,
        transform: compact ? "none" : `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        background: `linear-gradient(135deg, #FF671F 0%, #FFFFFF 35%, #D4AF37 50%, #FFFFFF 65%, #046A38 100%)`,
      }}
    >
      <div
        ref={cardRef}
        className="relative rounded-[1.65rem] px-6 py-7 text-center overflow-hidden"
        style={{ background: themeStyles.bg }}
      >
        {/* Holographic interactive sheen overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 rounded-[1.65rem]"
          style={{
            background: `radial-gradient(circle at ${sheen.x}% ${sheen.y}%, rgba(255,255,255,${sheen.opacity}) 0%, transparent 60%)`,
          }}
        />

        {/* Subtle Watermark Chakra */}
        <div className="pointer-events-none absolute -right-12 -top-12 opacity-[0.06] select-none">
          <AshokaChakra size={260} animate={false} color="#ffffff" />
        </div>
        <div className="pointer-events-none absolute -left-12 -bottom-12 opacity-[0.06] select-none">
          <AshokaChakra size={260} animate={false} color="#ffffff" />
        </div>

        {/* Top Header Badge with Auto-Calculated Edition & Year */}
        <div className="relative z-10 flex items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div className="flex items-center gap-1.5">
            <span className="text-base select-none">🇮🇳</span>
            <span className="text-[11px] font-bold tracking-widest uppercase text-slate-300">
              Azadi Ka Mahotsav · {ordinalEdition} Edition
            </span>
          </div>
          <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${themeStyles.badgeBg}`}>
            15th August {targetYear}
          </div>
        </div>

        {/* Dedicated Recipient Banner */}
        {recipientName && (
          <div className="relative z-10 mt-4 inline-block">
            <span className="text-[11px] font-medium tracking-wide text-amber-200/90 uppercase px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 shadow-sm">
              Dedicated to: <strong className="font-bold text-white">{recipientName}</strong>
            </span>
          </div>
        )}

        {/* Center Ashoka Chakra Medallion */}
        <div className="relative z-10 my-5 flex justify-center">
          <div className="relative flex items-center justify-center">
            {/* Ambient Halo */}
            <div className="absolute h-24 w-24 rounded-full bg-amber-400/15 blur-xl pointer-events-none" />
            <div className="relative rounded-full p-2.5 bg-slate-950/80 border border-amber-400/40 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <AshokaChakra size={compact ? 52 : 68} color="#2563eb" animate={true} />
            </div>
          </div>
        </div>

        {/* Festive Title */}
        <h2
          className={`relative z-10 font-extrabold tracking-tight text-white drop-shadow-sm ${fontClasses}`}
          style={{ fontSize: compact ? 22 : 28 }}
        >
          {title}
        </h2>

        {/* Tricolor Ribbon Accent */}
        <div className="my-3 mx-auto h-[3px] w-32 rounded-full bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#046A38] opacity-90 shadow" />

        {/* Countdown Tiles */}
        <div className="relative z-10 my-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            {countdown.isComplete ? "Celebration In Progress" : `Countdown to 15th August ${targetYear}`}
          </div>

          {countdown.isComplete ? (
            <div className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-blue-500/20 border border-amber-400/30 text-amber-200 font-bold text-sm">
              🇮🇳 Happy Independence Day! Jai Hind! 🇮🇳
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 max-w-[340px] mx-auto">
              {[
                { val: countdown.days, label: "Days", color: "text-amber-400" },
                { val: countdown.hours, label: "Hours", color: "text-orange-300" },
                { val: countdown.minutes, label: "Mins", color: "text-slate-200" },
                { val: countdown.seconds, label: "Secs", color: "text-emerald-400" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-slate-950/70 border border-white/10 p-2 shadow-inner text-center"
                >
                  <div className={`text-lg font-black tracking-tight ${item.color}`}>
                    {String(item.val).padStart(2, "0")}
                  </div>
                  <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Patriotic Quote Box */}
        <div className="relative z-10 my-4 rounded-2xl bg-white/[0.04] border border-white/10 p-3.5 text-slate-200 shadow-inner">
          <p
            className="italic leading-relaxed text-slate-200 font-serif"
            style={{ fontSize: compact ? 12 : 13 }}
          >
            "{message}"
          </p>
          {author && (
            <div className="mt-1.5 text-right text-[11px] font-semibold text-amber-400">
              — {author}
            </div>
          )}
        </div>

        {/* Signature From Sender */}
        <div className="relative z-10 mt-5 pt-3 border-t border-white/10">
          <div className="text-[11px] font-medium tracking-wide text-slate-400">
            Warm wishes with pride &amp; honor from
          </div>
          <div
            className="mt-1 font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-white to-emerald-300 font-sans"
            style={{ fontSize: compact ? 18 : 22 }}
          >
            {senderName || "Your Name"}
          </div>
          <div className="mt-1 text-[10px] text-slate-400 font-semibold tracking-widest uppercase">
            Jai Hind · Vande Mataram
          </div>
        </div>

        {/* Card Bottom Tricolor Ribbon */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#046A38]" />
      </div>
    </div>
  );
};

const Index = () => {
  const autoInfo = useMemo(() => getIndependenceDayInfo(), []);

  const params = useMemo(
    () => (typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams()),
    []
  );

  const initialName =
    params.get("name") || (typeof window !== "undefined" ? localStorage.getItem("idw:name") || "" : "");
  const initialRecipient =
    params.get("to") || (typeof window !== "undefined" ? localStorage.getItem("idw:to") || "" : "");
  const initialTitle =
    params.get("title") ||
    (typeof window !== "undefined" ? localStorage.getItem("idw:title") || autoInfo.celebrationTitle : autoInfo.celebrationTitle);
  const initialTheme =
    (params.get("theme") as CardTheme) ||
    (typeof window !== "undefined" ? (localStorage.getItem("idw:theme") as CardTheme) || "midnight" : "midnight");
  const initialFont =
    (params.get("font") as CardFontStyle) ||
    (typeof window !== "undefined" ? (localStorage.getItem("idw:font") as CardFontStyle) || "serif" : "serif");

  // Verify stored target date: if it's already expired/in the past, roll forward automatically to coming year!
  const storedDate =
    params.get("date") || (typeof window !== "undefined" ? localStorage.getItem("idw:date") : null) || null;
  const storedTime = storedDate ? new Date(storedDate).getTime() : NaN;
  const initialDate = Number.isFinite(storedTime) && storedTime > Date.now() ? storedDate! : autoInfo.targetISO;

  // State
  const [senderName, setSenderName] = useState<string>(initialName);
  const [recipientName, setRecipientName] = useState<string>(initialRecipient);
  const [greetingTitle, setGreetingTitle] = useState<string>(initialTitle);
  const [targetDate, setTargetDate] = useState<string>(initialDate);
  const [cardTheme, setCardTheme] = useState<CardTheme>(initialTheme);
  const [cardFont, setCardFont] = useState<CardFontStyle>(initialFont);
  const [activeTab, setActiveTab] = useState<"message" | "theme" | "timer">("message");
  const [selectedQuoteId, setSelectedQuoteId] = useState<string>("festive-1");
  const [customMessage, setCustomMessage] = useState<string>(PATRIOTIC_QUOTES[4].quote);
  const [quoteAuthor, setQuoteAuthor] = useState<string>(PATRIOTIC_QUOTES[4].author);

  // Audio state
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [isMuted, setIsMuted] = useState(false);
  const prevVolumeRef = useRef(0.6);

  // Modals & exporting
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const countdown = useCountdown(targetDate);

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem("idw:name", senderName);
      localStorage.setItem("idw:to", recipientName);
      localStorage.setItem("idw:title", greetingTitle);
      localStorage.setItem("idw:date", targetDate);
      localStorage.setItem("idw:theme", cardTheme);
      localStorage.setItem("idw:font", cardFont);
    } catch {}
  }, [senderName, recipientName, greetingTitle, targetDate, cardTheme, cardFont]);

  // Audio element sync
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
      return next;
    });
  };

  const togglePlay = async () => {
    if (!audioRef.current) return;
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (e) {
      toast({
        title: "Audio Playback",
        description: "Click play to start Vande Mataram instrumental.",
      });
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isField = tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable;
      if (isField) return;

      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.key.toLowerCase() === "m") {
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

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume, isPlaying, isMuted]);

  // Initial confetti burst on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      fireCelebrationConfetti();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Export card as PNG
  const exportAsPng = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `independence-day-${senderName ? senderName.toLowerCase().replace(/\s+/g, "-") : "greeting"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      fireCelebrationConfetti();
      toast({
        title: "Greeting Card Saved",
        description: "Your personalized card was downloaded as a high-resolution PNG image.",
      });
    } catch (err) {
      toast({
        title: "Export Failed",
        description: "Could not generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Export card as PDF
  const exportAsPdf = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(
        `independence-day-${senderName ? senderName.toLowerCase().replace(/\s+/g, "-") : "greeting"}.pdf`
      );
      toast({
        title: "PDF Saved",
        description: "Your greeting card has been saved as a PDF document.",
      });
    } catch (err) {
      toast({
        title: "Export Failed",
        description: "Could not generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Generate shareable link
  const getShareableUrl = () => {
    const url = new URL(window.location.origin + window.location.pathname);
    if (senderName) url.searchParams.set("name", senderName);
    if (recipientName) url.searchParams.set("to", recipientName);
    if (greetingTitle) url.searchParams.set("title", greetingTitle);
    if (cardTheme) url.searchParams.set("theme", cardTheme);
    if (cardFont) url.searchParams.set("font", cardFont);
    if (targetDate) url.searchParams.set("date", targetDate);
    return url.toString();
  };

  const copyShareLink = async () => {
    const url = getShareableUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
      fireCelebrationConfetti();
      toast({
        title: "Link Copied to Clipboard",
        description: "Anyone opening this link will see your customized greeting card and countdown.",
      });
    } catch {
      window.prompt("Copy this link:", url);
    }
  };

  const resetAllDefaults = () => {
    setSenderName("");
    setRecipientName("");
    setGreetingTitle(autoInfo.celebrationTitle);
    setTargetDate(autoInfo.targetISO);
    setCardTheme("midnight");
    setCardFont("serif");
    setSelectedQuoteId("festive-1");
    setCustomMessage(PATRIOTIC_QUOTES[4].quote);
    setQuoteAuthor(PATRIOTIC_QUOTES[4].author);
    try {
      localStorage.clear();
    } catch {}
    toast({
      title: "Settings Restored",
      description: `Default ${autoInfo.ordinalEdition} celebration greeting, theme, and countdown restored.`,
    });
  };

  return (
    <div className="relative min-h-screen bg-[#070c18] text-slate-100 selection:bg-amber-500 selection:text-black pb-28">
      {/* Dynamic Celebration Embers & Floating Lights Canvas */}
      <CelebrationCanvas />

      {/* Ambient Patriotic Aurora Glow in Background */}
      <div className="patriotic-aurora" aria-hidden="true">
        <div
          className="aurora-orb animate-orb-1"
          style={{
            width: 450,
            height: 450,
            top: "5%",
            left: "5%",
            background: "radial-gradient(circle, rgba(255, 103, 31, 0.22) 0%, transparent 70%)",
          }}
        />
        <div
          className="aurora-orb animate-orb-2"
          style={{
            width: 500,
            height: 500,
            bottom: "5%",
            right: "5%",
            background: "radial-gradient(circle, rgba(4, 106, 56, 0.22) 0%, transparent 70%)",
          }}
        />
        <div
          className="aurora-orb"
          style={{
            width: 350,
            height: 350,
            top: "40%",
            left: "40%",
            background: "radial-gradient(circle, rgba(6, 3, 141, 0.18) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Audio element */}
      <audio ref={audioRef} src={vandemataram} loop preload="auto" />

      {/* Top Header Navigation */}
      <header className="relative z-30 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-3.5">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-emerald-500 p-[1px] shadow-lg">
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-slate-950">
                <AshokaChakra size={24} color="#3b82f6" animate={true} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight text-white font-sans">
                  Pixel Perfect
                </h1>
                <span className="rounded-md bg-gradient-to-r from-amber-500 to-orange-500 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-950">
                  Tiranga
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Indian Independence Day Studio · {autoInfo.targetYear}
              </p>
            </div>
          </div>

          {/* Controls: Music Player & Confetti */}
          <div className="flex items-center gap-2.5">
            <MusicPlayer
              isPlaying={isPlaying}
              isMuted={isMuted}
              volume={volume}
              onTogglePlay={togglePlay}
              onToggleMute={toggleMute}
              onVolumeChange={(v) => {
                setVolume(v);
                if (v > 0 && isMuted) setIsMuted(false);
              }}
            />

            <button
              type="button"
              onClick={fireCelebrationConfetti}
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-md transition hover:scale-105 active:scale-95"
              aria-label="Launch celebratory fireworks confetti"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Celebrate</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Section */}
      <main className="container mx-auto px-4 pt-8 pb-16 relative z-10">
        {/* Banner Hero with Dynamic Milestone Info */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-xs font-semibold text-amber-300 backdrop-blur-md mb-3">
            <Flag className="h-3.5 w-3.5 text-amber-400" />
            <span>{autoInfo.heroBadgeText}</span>
          </div>

          {autoInfo.isTodayIndependenceDay && (
            <div className="mb-3">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/25 border border-emerald-400/50 text-emerald-300 font-bold text-xs animate-pulse">
                🇮🇳 Today is August 15th — Happy Independence Day! Jai Hind!
              </span>
            </div>
          )}

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-sans">
            Personalized <span className="gold-shimmer-text font-serif">Patriotic Greetings</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-xl mx-auto font-medium">
            Hover over the card to explore the 3D foil reflection. Customize typography, dedications, and themes. Automatically rolling forward for {autoInfo.targetYear} &amp; future years.
          </p>
        </div>

        {/* Studio Grid: Left Card, Right Customizer */}
        <div className="grid lg:grid-cols-[1fr_450px] gap-8 items-start max-w-6xl mx-auto">
          {/* Card Presentation Stage */}
          <div className="flex flex-col items-center">
            <div className="w-full flex justify-center py-2">
              <WishCard
                senderName={senderName}
                recipientName={recipientName}
                title={greetingTitle}
                message={customMessage}
                author={quoteAuthor}
                countdown={countdown}
                theme={cardTheme}
                fontStyle={cardFont}
                targetYear={autoInfo.targetYear}
                ordinalEdition={autoInfo.ordinalEdition}
                cardRef={cardRef}
              />
            </div>

            {/* Quick Action Buttons */}
            <div className="w-full max-w-[480px] mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={exportAsPng}
                disabled={isExporting}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 border border-white/15 px-3 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-slate-800 hover:border-amber-400/50 disabled:opacity-50"
              >
                <Download className="h-4 w-4 text-amber-400" />
                <span>PNG Card</span>
              </button>

              <button
                type="button"
                onClick={exportAsPdf}
                disabled={isExporting}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 border border-white/15 px-3 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-slate-800 hover:border-amber-400/50 disabled:opacity-50"
              >
                <FileText className="h-4 w-4 text-orange-400" />
                <span>PDF Document</span>
              </button>

              <button
                type="button"
                onClick={copyShareLink}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 border border-white/15 px-3 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-slate-800 hover:border-amber-400/50"
              >
                {copiedLink ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-300">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-emerald-400" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsQrOpen(true)}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 border border-white/15 px-3 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-slate-800 hover:border-amber-400/50"
              >
                <QrCode className="h-4 w-4 text-blue-400" />
                <span>QR Code</span>
              </button>
            </div>
          </div>

          {/* Customization Studio Panel */}
          <div className="w-full rounded-2xl bg-slate-900/85 border border-white/15 p-5 shadow-2xl backdrop-blur-xl">
            {/* Panel Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Palette className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Customization Studio
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Personalize typography, colors &amp; dedication
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={resetAllDefaults}
                className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-white px-2 py-1 rounded-lg border border-white/10 hover:bg-white/5 transition"
                title="Reset to defaults"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-950 p-1 mb-5">
              <button
                type="button"
                onClick={() => setActiveTab("message")}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition ${
                  activeTab === "message"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <User className="h-3.5 w-3.5" />
                <span>Details</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("theme")}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition ${
                  activeTab === "theme"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Palette className="h-3.5 w-3.5" />
                <span>Style</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("timer")}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition ${
                  activeTab === "timer"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>Date</span>
              </button>
            </div>

            {/* Tab 1: Details & Messages */}
            {activeTab === "message" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Name (Sender)
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g., Rahul Kumar"
                    className="w-full rounded-xl bg-slate-950/80 border border-white/15 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Recipient / Dedication
                    </label>
                    <span className="text-[10px] text-amber-400 font-medium">Quick presets</span>
                  </div>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g., Dear Family, Everyone"
                    className="w-full rounded-xl bg-slate-950/80 border border-white/15 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition mb-2"
                  />

                  {/* Preset dedication tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Brave Armed Forces 🇮🇳",
                      "Dear Family & Friends 🌸",
                      "All Proud Citizens 🌟",
                      "Respected Teachers 🤝",
                    ].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setRecipientName(tag)}
                        className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-slate-950 border border-white/10 text-slate-300 hover:text-white hover:border-amber-400/40 transition"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Celebration Headline
                  </label>
                  <input
                    type="text"
                    value={greetingTitle}
                    onChange={(e) => setGreetingTitle(e.target.value)}
                    placeholder={autoInfo.celebrationTitle}
                    className="w-full rounded-xl bg-slate-950/80 border border-white/15 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Patriotic Quotes &amp; Wishes
                    </label>
                    <span className="text-[10px] text-amber-400 font-medium">
                      Pick a preset
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {PATRIOTIC_QUOTES.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSelectedQuoteId(item.id);
                          setCustomMessage(item.quote);
                          setQuoteAuthor(item.author);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl border text-xs transition ${
                          selectedQuoteId === item.id
                            ? "bg-amber-500/15 border-amber-400/50 text-white"
                            : "bg-slate-950/60 border-white/10 text-slate-300 hover:border-white/25 hover:bg-slate-950"
                        }`}
                      >
                        <div className="font-bold text-amber-300 text-[11px]">
                          {item.author}
                        </div>
                        <div className="line-clamp-2 mt-0.5 text-slate-300 text-[11px] leading-relaxed">
                          "{item.quote}"
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Custom Message Text
                  </label>
                  <textarea
                    rows={2}
                    value={customMessage}
                    onChange={(e) => {
                      setCustomMessage(e.target.value);
                      setSelectedQuoteId("custom");
                    }}
                    placeholder="Type your bespoke wish..."
                    className="w-full rounded-xl bg-slate-950/80 border border-white/15 p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                  />
                </div>
              </div>
            )}

            {/* Tab 2: Theme & Typography Selector */}
            {activeTab === "theme" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Card Typography Style
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "regal" as CardFontStyle, label: "Cinzel Regal" },
                      { id: "serif" as CardFontStyle, label: "Playfair Serif" },
                      { id: "traditional" as CardFontStyle, label: "Rozha Traditional" },
                      { id: "modern" as CardFontStyle, label: "Jakarta Modern" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setCardFont(f.id)}
                        className={`p-2.5 rounded-xl border text-left transition ${
                          cardFont === f.id
                            ? "bg-amber-500/15 border-amber-400 text-white shadow"
                            : "bg-slate-950/60 border-white/10 text-slate-300 hover:border-white/20"
                        }`}
                      >
                        <div className="text-xs font-bold">{f.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Select Visual Aesthetic
                  </label>

                  <div className="space-y-2">
                    {[
                      {
                        id: "midnight" as CardTheme,
                        name: "Royal Midnight",
                        desc: "Deep navy blue with gold foil & tricolor aurora",
                        preview: "from-blue-950 via-slate-900 to-indigo-950",
                        border: "border-amber-400/40",
                      },
                      {
                        id: "saffron" as CardTheme,
                        name: "Saffron Dawn",
                        desc: "Warm radiant saffron sunrise with gold filigree",
                        preview: "from-orange-900 via-amber-950 to-slate-950",
                        border: "border-orange-500/40",
                      },
                      {
                        id: "tiranga" as CardTheme,
                        name: "Tiranga Heritage",
                        desc: "Crisp pure tricolor bands with sleek modern minimalism",
                        preview: "from-slate-900 via-slate-950 to-emerald-950",
                        border: "border-white/30",
                      },
                      {
                        id: "emerald" as CardTheme,
                        name: "Emerald Sovereign",
                        desc: "Lush tricolor jade green with golden sheen",
                        preview: "from-emerald-950 via-teal-950 to-slate-950",
                        border: "border-emerald-500/40",
                      },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setCardTheme(t.id)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition ${
                          cardTheme === t.id
                            ? "bg-amber-500/15 border-amber-400 text-white shadow-lg"
                            : "bg-slate-950/60 border-white/10 text-slate-300 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-8 w-8 rounded-xl bg-gradient-to-br ${t.preview} border ${t.border} shadow-inner flex items-center justify-center text-xs`}
                          >
                            🇮🇳
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">{t.name}</div>
                            <div className="text-[10px] text-slate-400">{t.desc}</div>
                          </div>
                        </div>
                        {cardTheme === t.id && (
                          <div className="h-4 w-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-[10px]">
                            ✓
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Countdown Date */}
            {activeTab === "timer" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Target Celebration Date &amp; Time
                  </label>
                  <input
                    type="datetime-local"
                    value={targetDate.slice(0, 16)}
                    onChange={(e) => setTargetDate(e.target.value + ":00")}
                    className="w-full rounded-xl bg-slate-950/80 border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                  />
                  <p className="mt-1.5 text-[11px] text-slate-400 leading-relaxed">
                    By default, the countdown automatically targets India's next Independence Day on August 15th ({autoInfo.targetYear}) at midnight.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setTargetDate(autoInfo.targetISO)}
                    className="w-full rounded-xl bg-slate-950 border border-white/15 py-2.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition"
                  >
                    Reset to Next Independence Day (15th August {autoInfo.targetYear})
                  </button>
                </div>
              </div>
            )}

            {/* Quick Share on WhatsApp Action */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `🇮🇳 ${greetingTitle}! Here is a personalized celebratory wish card for you from ${
                    senderName || "your friend"
                  }:\n\n${getShareableUrl()}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 py-3 text-xs font-bold text-white shadow-lg transition hover:brightness-110 active:scale-98"
              >
                <Share2 className="h-4 w-4" />
                <span>Share Instantly on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Bottom Bar for Mobile Convenience */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 border-t border-white/10 p-3 backdrop-blur-xl sm:hidden">
        <div className="flex items-center gap-2">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `🇮🇳 ${greetingTitle}! Personalized wish from ${senderName || "Friend"}: ${getShareableUrl()}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={exportAsPng}
            disabled={isExporting}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-slate-950 shadow"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download</span>
          </button>
          <button
            type="button"
            onClick={fireCelebrationConfetti}
            className="flex items-center justify-center rounded-xl bg-slate-900 border border-white/20 p-2.5 text-amber-400 shadow"
            aria-label="Celebrate fireworks"
          >
            <Sparkles className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        url={getShareableUrl()}
      />
    </div>
  );
};

export default Index;
