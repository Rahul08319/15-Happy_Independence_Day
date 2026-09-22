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
  Music,
  ShieldCheck,
  Layers,
  Smartphone,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import AshokaChakra from "@/components/AshokaChakra";
import MusicPlayer from "@/components/MusicPlayer";
import QRCodeModal from "@/components/QRCodeModal";
import CelebrationCanvas from "@/components/CelebrationCanvas";
import FloatingKites from "@/components/FloatingKites";
import IndependenceHistorySection from "@/components/IndependenceHistorySection";
import { PATRIOTIC_QUOTES } from "@/components/patrioticQuotes";
import { getIndependenceDayInfo } from "@/lib/independenceDay";
import vandemataram from "@/assets/vandemataram.mp3";

const TRICOLORS = ["#FF671F", "#FFFFFF", "#046A38", "#06038D", "#D4AF37"];

const playCelebrationChime = () => {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    // Patriotic fanfare sequence: C5, E5, G5, C6 arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);
      gain.gain.setValueAtTime(0.2, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.32);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.34);
    });
  } catch {
    // AudioContext may be restricted before gesture
  }
};

const fireCelebrationConfetti = () => {
  if (typeof window === "undefined") return;

  playCelebrationChime();

  try {
    const defaults = {
      colors: TRICOLORS,
      zIndex: 999999,
      disableForReducedMotion: false,
    };

    // Left cannon
    confetti({
      ...defaults,
      particleCount: 85,
      spread: 80,
      origin: { x: 0.1, y: 0.8 },
      angle: 55,
      scalar: 1.1,
    });

    // Right cannon
    confetti({
      ...defaults,
      particleCount: 85,
      spread: 80,
      origin: { x: 0.9, y: 0.8 },
      angle: 125,
      scalar: 1.1,
    });

    // Center star burst
    setTimeout(() => {
      try {
        confetti({
          ...defaults,
          particleCount: 150,
          spread: 120,
          startVelocity: 55,
          origin: { x: 0.5, y: 0.45 },
          scalar: 1.25,
        });
      } catch {}
    }, 200);

    // Falling confetti shower
    setTimeout(() => {
      try {
        confetti({
          ...defaults,
          particleCount: 90,
          spread: 90,
          startVelocity: 35,
          origin: { x: 0.5, y: 0.2 },
          ticks: 300,
        });
      } catch {}
    }, 450);
  } catch (err) {
    console.warn("Celebration confetti:", err);
  }
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

// Main Greeting Card with Apple Liquid Glass Specular & 3D Interactive Spring Tilt
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
    const rotateX = -((y - centerY) / centerY) * 7.5;
    const rotateY = ((x - centerX) / centerX) * 7.5;
    setRotate({ x: rotateX, y: rotateY });
    setSheen({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.18,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setSheen({ x: 50, y: 50, opacity: 0 });
  };

  const themeStyles = {
    midnight: {
      bg: "linear-gradient(165deg, rgba(11,19,41,0.85) 0%, rgba(6,9,19,0.92) 50%, rgba(13,27,62,0.88) 100%)",
      badgeBg: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    },
    saffron: {
      bg: "linear-gradient(165deg, rgba(43,17,4,0.88) 0%, rgba(21,8,2,0.94) 50%, rgba(61,23,4,0.88) 100%)",
      badgeBg: "bg-orange-500/15 text-orange-300 border-orange-500/30",
    },
    tiranga: {
      bg: "linear-gradient(165deg, rgba(19,29,46,0.85) 0%, rgba(10,17,28,0.92) 50%, rgba(12,35,26,0.88) 100%)",
      badgeBg: "bg-white/10 text-white border-white/20",
    },
    emerald: {
      bg: "linear-gradient(165deg, rgba(6,36,25,0.88) 0%, rgba(3,20,14,0.94) 50%, rgba(8,52,36,0.88) 100%)",
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
      className="relative mx-auto rounded-[2.25rem] p-[2.5px] cursor-pointer select-none transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9)] animated-card-border"
      style={{
        maxWidth: compact ? 340 : 480,
        transform: compact ? "none" : `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
      }}
    >
      <div
        ref={cardRef}
        className="relative rounded-[2.15rem] px-7 py-8 text-center overflow-hidden backdrop-blur-2xl border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
        style={{ background: themeStyles.bg }}
      >
        {/* Holographic light sweep across the card */}
        <div className="holographic-card-sheen rounded-[2.15rem]" />

        {/* Apple Liquid Glass Specular Arc */}
        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 rounded-[2.15rem]"
          style={{
            background: `radial-gradient(ellipse 80% 45% at ${sheen.x}% ${sheen.y}%, rgba(255,255,255,${sheen.opacity}) 0%, transparent 60%)`,
          }}
        />

        {/* Counter-Rotating Watermark Ashoka Chakra Backgrounds */}
        <div className="pointer-events-none absolute -right-14 -top-14 opacity-[0.06] select-none animate-[spin_90s_linear_infinite]">
          <AshokaChakra size={280} animate={false} color="#ffffff" />
        </div>
        <div className="pointer-events-none absolute -left-14 -bottom-14 opacity-[0.06] select-none animate-[spin_90s_linear_infinite_reverse]">
          <AshokaChakra size={280} animate={false} color="#ffffff" />
        </div>

        {/* Top Header Badge */}
        <div className="relative z-10 flex items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-base select-none">🇮🇳</span>
            <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-slate-300">
              Azadi Ka Mahotsav · {ordinalEdition} Edition
            </span>
          </div>
          <div className={`px-3 py-0.5 rounded-full text-[10px] font-semibold border ${themeStyles.badgeBg}`}>
            15th August {targetYear}
          </div>
        </div>

        {/* Dedicated Recipient Banner */}
        {recipientName && (
          <div className="relative z-10 mt-4 inline-block animate-float">
            <span className="text-[11px] font-medium tracking-wide text-amber-200/90 uppercase px-4 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 shadow-sm">
              Dedicated to: <strong className="font-bold text-white">{recipientName}</strong>
            </span>
          </div>
        )}

        {/* Center Ashoka Chakra Medallion with Floating Glow Physics */}
        <div className="relative z-10 my-6 flex justify-center">
          <div className="relative flex items-center justify-center">
            <div className="absolute h-28 w-28 rounded-full bg-amber-400/20 blur-2xl pointer-events-none animate-pulse" />
            <div className="relative rounded-full p-3 bg-slate-950/80 border border-amber-400/50 medallion-glow animate-float">
              <AshokaChakra size={compact ? 54 : 70} color="#3b82f6" animate={true} />
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

        {/* Animated Tricolor Ribbon Accent */}
        <div className="my-3.5 mx-auto h-[3.5px] w-40 rounded-full tricolor-ribbon-animated opacity-95 shadow" />

        {/* Countdown Tiles with Apple Glass Polish */}
        <div className="relative z-10 my-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400 mb-2.5">
            {countdown.isComplete ? "Celebration In Progress" : `Countdown to 15th August ${targetYear}`}
          </div>

          {countdown.isComplete ? (
            <div className="py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-blue-500/20 border border-amber-400/35 text-amber-200 font-bold text-sm shadow-inner">
              🇮🇳 Happy Independence Day! Jai Hind! 🇮🇳
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2.5 max-w-[350px] mx-auto">
              {[
                { val: countdown.days, label: "Days", color: "text-amber-400" },
                { val: countdown.hours, label: "Hours", color: "text-orange-300" },
                { val: countdown.minutes, label: "Mins", color: "text-slate-200" },
                { val: countdown.seconds, label: "Secs", color: "text-emerald-400" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-slate-950/75 border border-white/12 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] text-center transition-transform hover:scale-105"
                >
                  <div className={`text-xl font-black tracking-tight ${item.color}`}>
                    {String(item.val).padStart(2, "0")}
                  </div>
                  <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Patriotic Quote Box */}
        <div className="relative z-10 my-4 rounded-2xl bg-white/[0.04] border border-white/10 p-4 text-slate-200 shadow-inner backdrop-blur-sm">
          <p
            className="italic leading-relaxed text-slate-200 font-serif"
            style={{ fontSize: compact ? 12 : 13.5 }}
          >
            "{message}"
          </p>
          {author && (
            <div className="mt-2 text-right text-[11px] font-semibold text-amber-400">
              — {author}
            </div>
          )}
        </div>

        {/* Signature From Sender */}
        <div className="relative z-10 mt-5 pt-3.5 border-t border-white/10">
          <div className="text-[11px] font-medium tracking-wide text-slate-400">
            Warm wishes with pride &amp; honor from
          </div>
          <div
            className="mt-1 font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-white to-emerald-300 font-sans"
            style={{ fontSize: compact ? 18 : 22 }}
          >
            {senderName || "Your Name"}
          </div>
          <div className="mt-1 text-[10px] text-slate-400 font-semibold tracking-[0.12em] uppercase">
            Jai Hind · Vande Mataram
          </div>
        </div>

        {/* Bottom Tricolor Ribbon */}
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

  const [isCelebrating, setIsCelebrating] = useState(false);

  const handleCelebrateClick = () => {
    setIsCelebrating(true);
    fireCelebrationConfetti();

    toast({
      title: "🇮🇳 Happy Independence Day! Jai Hind!",
      description: "Celebrations initiated with fireworks and patriotic music!",
    });

    if (!isPlaying && audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }

    setTimeout(() => setIsCelebrating(false), 2200);
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

  // Initial celebratory confetti
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
    <div className="relative min-h-screen bg-[#050811] text-slate-100 selection:bg-amber-500 selection:text-black pb-28">
      {/* Dynamic Celebration Embers & Floating Lights Canvas */}
      <CelebrationCanvas />

      {/* Canva-Inspired Celebratory Flying Kites (Patang) */}
      <FloatingKites />

      {/* Ambient Patriotic Aurora Mesh */}
      <div className="patriotic-aurora" aria-hidden="true">
        <div
          className="aurora-orb animate-orb-1"
          style={{
            width: 480,
            height: 480,
            top: "5%",
            left: "5%",
            background: "radial-gradient(circle, rgba(255, 103, 31, 0.24) 0%, transparent 70%)",
          }}
        />
        <div
          className="aurora-orb animate-orb-2"
          style={{
            width: 520,
            height: 520,
            bottom: "5%",
            right: "5%",
            background: "radial-gradient(circle, rgba(4, 106, 56, 0.24) 0%, transparent 70%)",
          }}
        />
        <div
          className="aurora-orb animate-orb-3"
          style={{
            width: 380,
            height: 380,
            top: "40%",
            left: "40%",
            background: "radial-gradient(circle, rgba(6, 3, 141, 0.20) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Audio element */}
      <audio ref={audioRef} src={vandemataram} loop preload="auto" />

      {/* Apple Floating Island Navigation Capsule */}
      <nav className="fixed top-4 left-0 right-0 z-40 flex justify-center px-4">
        <div className="apple-floating-island flex items-center justify-between gap-3 sm:gap-6 rounded-full px-4 py-2.5 max-w-4xl w-full shadow-2xl transition-all duration-300">
          {/* Brand Pill */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-emerald-500 p-[1.5px] shadow-md transition-transform hover:scale-105 active:scale-95">
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-slate-950">
                <AshokaChakra size={22} color="#3b82f6" animate={true} />
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-tight text-white">Happy Independence Day</span>
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[9px] font-bold text-amber-300 border border-amber-500/30">
                  {autoInfo.targetYear}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Tiranga Celebration Studio</p>
            </div>
          </div>

          {/* Center & Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
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
              onClick={handleCelebrateClick}
              className={`apple-btn flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-md transition-all active:scale-95 ${
                isCelebrating
                  ? "bg-gradient-to-r from-amber-400 via-white to-emerald-400 ring-2 ring-amber-300 scale-105"
                  : "bg-gradient-to-r from-amber-500 to-emerald-500 hover:brightness-110"
              }`}
              aria-label="Launch celebratory fireworks confetti"
            >
              <Sparkles className={`h-3.5 w-3.5 ${isCelebrating ? "animate-spin text-amber-900" : ""}`} />
              <span className="hidden sm:inline">
                {isCelebrating ? "Celebrating! 🇮🇳" : "Celebrate"}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Studio Section */}
      <main className="container mx-auto px-4 pt-28 pb-16 relative z-10">
        {/* Banner Hero with Apple Typography & Tight Tracking */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1 text-xs font-semibold text-amber-300 backdrop-blur-xl mb-3 shadow-inner animate-float">
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

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-[-0.03em] text-white leading-[1.08] font-sans">
            Personalized <span className="gold-shimmer-text font-serif">Patriotic Greetings</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-xl mx-auto font-medium leading-relaxed">
            Celebrate India's independence with a personalised card for {autoInfo.targetYear}.
          </p>
        </div>

        {/* Studio Grid: Left 3D Card, Right Customizer Panel */}
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

            {/* Apple Style Glass Action Buttons */}
            <div className="w-full max-w-[480px] mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={exportAsPng}
                disabled={isExporting}
                className="apple-glass-pill flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold text-white disabled:opacity-50"
              >
                <Download className="h-4 w-4 text-amber-400" />
                <span>PNG Card</span>
              </button>

              <button
                type="button"
                onClick={exportAsPdf}
                disabled={isExporting}
                className="apple-glass-pill flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold text-white disabled:opacity-50"
              >
                <FileText className="h-4 w-4 text-orange-400" />
                <span>PDF Doc</span>
              </button>

              <button
                type="button"
                onClick={copyShareLink}
                className="apple-glass-pill flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold text-white"
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
                className="apple-glass-pill flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold text-white"
              >
                <QrCode className="h-4 w-4 text-blue-400" />
                <span>QR Code</span>
              </button>
            </div>
          </div>

          {/* Customization Studio Panel */}
          <div className="w-full rounded-[2rem] bg-slate-900/80 border border-white/15 p-6 shadow-2xl backdrop-blur-2xl">
            {/* Panel Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-sm">
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
                className="apple-btn flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-white px-2.5 py-1 rounded-full border border-white/10 hover:bg-white/5 transition"
                title="Reset to defaults"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Apple Native Segmented Controls */}
            <div className="apple-segmented-track grid grid-cols-3 gap-1 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab("message")}
                className={`apple-btn flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-bold transition-all duration-300 ${
                  activeTab === "message"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <User className="h-3.5 w-3.5" />
                <span>Details</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("theme")}
                className={`apple-btn flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-bold transition-all duration-300 ${
                  activeTab === "theme"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Palette className="h-3.5 w-3.5" />
                <span>Style</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("timer")}
                className={`apple-btn flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-bold transition-all duration-300 ${
                  activeTab === "timer"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md"
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
                        className="apple-btn text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-950 border border-white/10 text-slate-300 hover:text-white hover:border-amber-400/40 transition"
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
                    <span className="text-[10px] text-amber-400 font-medium">Pick a preset</span>
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
                        className={`apple-btn w-full text-left p-3 rounded-2xl border text-xs transition ${
                          selectedQuoteId === item.id
                            ? "bg-amber-500/15 border-amber-400/50 text-white shadow-sm"
                            : "bg-slate-950/60 border-white/10 text-slate-300 hover:border-white/25 hover:bg-slate-950"
                        }`}
                      >
                        <div className="font-bold text-amber-300 text-[11px]">{item.author}</div>
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
                        className={`apple-btn p-3 rounded-2xl border text-left transition ${
                          cardFont === f.id
                            ? "bg-amber-500/15 border-amber-400 text-white shadow-sm"
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
                        className={`apple-btn w-full flex items-center justify-between p-3 rounded-2xl border text-left transition ${
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
                    className="apple-btn w-full rounded-full bg-slate-950 border border-white/15 py-2.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition"
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
                className="apple-btn w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 py-3 text-xs font-bold text-white shadow-lg hover:brightness-110 active:scale-96"
              >
                <Share2 className="h-4 w-4" />
                <span>Share Instantly on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Visual Feature Bento */}
        <div className="mt-24 max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            {/* Tile 1 — Glass */}
            <div className="apple-glass rounded-3xl p-6 flex flex-col items-center justify-center gap-3 aspect-square relative overflow-hidden transition-all hover:scale-[1.02]" style={{background:"linear-gradient(135deg,rgba(251,191,36,0.08),rgba(180,83,9,0.04))"}}>
              <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
              <div className="h-14 w-14 rounded-2xl bg-amber-500/20 border border-amber-400/20 flex items-center justify-center text-amber-300 shadow-lg">
                <Layers className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold tracking-widest uppercase text-amber-300/80">Glass</span>
            </div>

            {/* Tile 2 — Audio (wide) with Live Equalizer Animation */}
            <div className="apple-glass rounded-3xl p-6 flex flex-col items-center justify-center gap-3 relative overflow-hidden transition-all hover:scale-[1.02] col-span-2" style={{background:"linear-gradient(135deg,rgba(59,130,246,0.08),rgba(29,78,216,0.04))"}}>
              <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
              {/* Dynamic live equalizer bars with staggered spring bounce */}
              <div className="flex items-end gap-[3px] h-10">
                {[
                  { delay: "0s", dur: "0.85s" },
                  { delay: "0.2s", dur: "1.15s" },
                  { delay: "0.4s", dur: "0.75s" },
                  { delay: "0.1s", dur: "1.3s" },
                  { delay: "0.5s", dur: "0.95s" },
                  { delay: "0.3s", dur: "1.2s" },
                  { delay: "0.6s", dur: "0.9s" },
                  { delay: "0.15s", dur: "1.1s" },
                  { delay: "0.45s", dur: "0.8s" },
                  { delay: "0.25s", dur: "1.25s" },
                  { delay: "0.55s", dur: "0.9s" },
                  { delay: "0.35s", dur: "1.05s" },
                  { delay: "0.05s", dur: "1.18s" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="w-1 rounded-full bg-blue-400/80 animate-bento-bar"
                    style={{
                      animationDelay: item.delay,
                      animationDuration: item.dur,
                    }}
                  />
                ))}
              </div>
              <div className="h-10 w-10 rounded-2xl bg-blue-500/20 border border-blue-400/20 flex items-center justify-center text-blue-300 shadow-sm">
                <Music className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold tracking-widest uppercase text-blue-300/80">Audio</span>
            </div>

            {/* Tile 3 — Share */}
            <div className="apple-glass rounded-3xl p-6 flex flex-col items-center justify-center gap-3 aspect-square relative overflow-hidden transition-all hover:scale-[1.02]" style={{background:"linear-gradient(135deg,rgba(16,185,129,0.08),rgba(6,95,70,0.04))"}}>
              <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/20 flex items-center justify-center text-emerald-300 shadow-lg">
                <Smartphone className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold tracking-widest uppercase text-emerald-300/80">Share</span>
            </div>

            {/* Tile 4 — Tricolour stripe (wide) with Smooth Rotating Chakra */}
            <div className="apple-glass rounded-3xl p-6 flex items-center justify-center gap-6 col-span-2 relative overflow-hidden transition-all hover:scale-[1.01]" style={{background:"linear-gradient(135deg,rgba(255,153,0,0.06),rgba(19,136,8,0.06))"}}>
              <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="flex flex-col gap-1">
                <div className="h-2.5 w-24 rounded-full bg-[#FF9933]/70 shadow-[0_0_8px_rgba(255,153,0,0.3)]" />
                <div className="h-2.5 w-24 rounded-full bg-white/50 shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
                <div className="h-2.5 w-24 rounded-full bg-[#138808]/70 shadow-[0_0_8px_rgba(19,136,8,0.3)]" />
              </div>
              <div className="h-12 w-12 rounded-full border-2 border-[#000080]/60 flex items-center justify-center animate-[spin_25s_linear_infinite] shadow-[0_0_12px_rgba(0,0,128,0.25)]">
                <div className="h-8 w-8 rounded-full border-2 border-[#000080]/40" />
              </div>
              <span className="text-xs font-semibold tracking-widest uppercase text-white/50">Tricolour</span>
            </div>

            {/* Tile 5 — Export */}
            <div className="apple-glass rounded-3xl p-6 flex flex-col items-center justify-center gap-3 aspect-square relative overflow-hidden transition-all hover:scale-[1.02]" style={{background:"linear-gradient(135deg,rgba(139,92,246,0.08),rgba(76,29,149,0.04))"}}>
              <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
              <div className="h-14 w-14 rounded-2xl bg-violet-500/20 border border-violet-400/20 flex items-center justify-center text-violet-300 shadow-lg">
                <Download className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold tracking-widest uppercase text-violet-300/80">Export</span>
            </div>

            {/* Tile 6 — Year badge */}
            <div className="apple-glass rounded-3xl p-6 flex flex-col items-center justify-center gap-2 aspect-square relative overflow-hidden transition-all hover:scale-[1.02]" style={{background:"linear-gradient(135deg,rgba(244,63,94,0.06),rgba(159,18,57,0.04))"}}>
              <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-rose-400/40 to-transparent" />
              <span className="text-4xl font-black tracking-tight text-rose-300/80 leading-none">{autoInfo.targetYear}</span>
              <span className="text-xs font-semibold tracking-widest uppercase text-rose-300/50">Edition</span>
            </div>

          </div>
        </div>

        {/* Wikipedia Historical Knowledge & National Traditions Section */}
        <IndependenceHistorySection />
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
            className="apple-btn flex-1 flex items-center justify-center gap-1.5 rounded-full bg-emerald-600 py-2.5 text-xs font-bold text-white shadow"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={exportAsPng}
            disabled={isExporting}
            className="apple-btn flex-1 flex items-center justify-center gap-1.5 rounded-full bg-amber-500 py-2.5 text-xs font-bold text-slate-950 shadow"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download</span>
          </button>
          <button
            type="button"
            onClick={handleCelebrateClick}
            className={`apple-btn flex items-center justify-center rounded-full border p-2.5 shadow transition-all ${
              isCelebrating
                ? "bg-amber-400 border-amber-300 text-slate-950 scale-110"
                : "bg-slate-900 border-white/20 text-amber-400"
            }`}
            aria-label="Celebrate fireworks"
          >
            <Sparkles className={`h-4 w-4 ${isCelebrating ? "animate-spin" : ""}`} />
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
