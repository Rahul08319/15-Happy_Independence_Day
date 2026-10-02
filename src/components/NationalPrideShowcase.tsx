import React, { useState } from "react";
import {
  Sparkles,
  Award,
  Heart,
  Shield,
  Volume2,
  Play,
  Pause,
  Flag,
  Flame,
  CheckCircle2,
  Share2,
  Layers,
} from "lucide-react";
import AshokaChakra from "./AshokaChakra";

interface NationalPrideProps {
  senderName?: string;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  onFireCelebration?: () => void;
  targetYear?: number;
}

const CHAKRA_VIRTUES = [
  { spoke: 1, name: "Love (Prem)", desc: "Unconditional love for the nation and humanity." },
  { spoke: 2, name: "Courage (Dhairya)", desc: "Valiance to stand firmly against injustice." },
  { spoke: 3, name: "Patience (Shanti)", desc: "Enduring calm and resilience through hardship." },
  { spoke: 4, name: "Righteousness (Dharma)", desc: "Living with upright ethical moral conduct." },
  { spoke: 5, name: "Magnanimity (Udaarta)", desc: "Generosity of spirit toward all fellow beings." },
  { spoke: 6, name: "Goodness (Achhai)", desc: "Cultivating benevolence and pure intentions." },
  { spoke: 7, name: "Faith (Vishwas)", desc: "Steadfast belief in the destiny of Mother India." },
  { spoke: 8, name: "Empathy (Daya)", desc: "Compassion toward the vulnerable and marginalized." },
  { spoke: 9, name: "Self-Control (Sanyam)", desc: "Mastery over impulsive desires and ego." },
  { spoke: 10, name: "Sacrifice (Tyag)", desc: "Readiness to place national good above the self." },
  { spoke: 11, name: "Truth (Satya)", desc: "Satyameva Jayate — Truth alone triumphs." },
  { spoke: 12, name: "Justice (Nyaya)", desc: "Fairness, constitutional equality, and rule of law." },
];

export const NationalPrideShowcase: React.FC<NationalPrideProps> = ({
  senderName = "",
  isPlaying = false,
  onTogglePlay,
  onFireCelebration,
  targetYear = 2027,
}) => {
  const [selectedVirtue, setSelectedVirtue] = useState(CHAKRA_VIRTUES[10]); // Truth (Satya) by default
  const [hasPledged, setHasPledged] = useState(false);
  const [pledgeHover, setPledgeHover] = useState(false);

  const handleTakePledge = () => {
    setHasPledged(true);
    if (onFireCelebration) {
      onFireCelebration();
    }
  };

  return (
    <section className="mt-24 max-w-6xl mx-auto px-2 relative z-10">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1 text-xs font-semibold text-amber-300 backdrop-blur-xl mb-3 shadow-inner">
          <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-spin" />
          <span className="tracking-wide uppercase text-[11px]">Living Emblems of Sovereign India</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-sans">
          The Spirit of <span className="gold-shimmer-text font-serif">Azadi &amp; Unity</span>
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-400 leading-relaxed">
          Explore the profound philosophy woven into our National Tricolor, the 24 Virtues of the Dharma Chakra, and seal your personal Pledge of Sovereign Unity.
        </p>
      </div>

      {/* ─── Row 1: The Three Pillars of Tiranga (Interactive Apple Glass Cards) ─── */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Pillar 1: Kesari / Saffron */}
        <div
          className="apple-glass rounded-[2rem] p-7 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-amber-400/40 group shadow-2xl"
          style={{
            background: "linear-gradient(165deg, rgba(45, 18, 4, 0.85) 0%, rgba(18, 8, 3, 0.95) 100%)",
          }}
        >
          {/* Top Ambient Glow & Specular Highlight */}
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent" />
          <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-orange-500/20 blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="text-2xl select-none">🟧</span>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-orange-500/15 text-orange-300 border border-orange-500/30">
                Kesari · Courage
              </span>
            </div>
            <h3 className="text-xl font-black text-white font-serif mb-2 tracking-wide">
              Valour &amp; Sacrifice
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              The top saffron band signifies supreme courage, selflessness, and the eternal spirit of freedom fighters who laid down their lives for national liberation.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-amber-200/90 font-medium italic">
            <span className="flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-orange-400" />
              <span>Shaurya aur Balidan</span>
            </span>
            <span className="text-slate-400 font-sans not-italic text-[10px]">#TirangaKesari</span>
          </div>
        </div>

        {/* Pillar 2: Shwet / White with Interactive 24-Spoke Chakra */}
        <div
          className="apple-glass rounded-[2rem] p-7 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-blue-400/40 group shadow-2xl"
          style={{
            background: "linear-gradient(165deg, rgba(13, 23, 44, 0.9) 0%, rgba(6, 11, 23, 0.96) 100%)",
          }}
        >
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />
          <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-blue-500/20 blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="text-2xl select-none">⚪</span>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-500/15 text-blue-300 border border-blue-500/30">
                Shwet · Dharma Chakra
              </span>
            </div>
            <h3 className="text-xl font-black text-white font-serif mb-2 tracking-wide">
              Peace &amp; Truth
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              The white band embodies purity, universal peace, and constitutional truth. In its center resides the 24-spoke Ashoka Chakra, representing righteous perpetual progress.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-blue-200/90 font-medium italic">
            <span className="flex items-center gap-1.5">
              <AshokaChakra size={16} color="#60a5fa" animate={true} />
              <span>Satya, Shanti, Nyaya</span>
            </span>
            <span className="text-slate-400 font-sans not-italic text-[10px]">#AshokaChakra</span>
          </div>
        </div>

        {/* Pillar 3: Hara / Emerald Green */}
        <div
          className="apple-glass rounded-[2rem] p-7 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-emerald-400/40 group shadow-2xl"
          style={{
            background: "linear-gradient(165deg, rgba(6, 36, 22, 0.85) 0%, rgba(3, 18, 11, 0.95) 100%)",
          }}
        >
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
          <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="text-2xl select-none">🟩</span>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Hara · Prosperity
              </span>
            </div>
            <h3 className="text-xl font-black text-white font-serif mb-2 tracking-wide">
              Life &amp; Agriculture
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              The lower emerald green band symbolizes mother earth, agricultural fertility, national industry, and the enduring prosperity of India's hardworking people.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-200/90 font-medium italic">
            <span className="flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5 text-emerald-400" />
              <span>Samriddhi aur Vishwas</span>
            </span>
            <span className="text-slate-400 font-sans not-italic text-[10px]">#JaiKisan</span>
          </div>
        </div>
      </div>

      {/* ─── Row 2: Interactive 24 Virtues Explorer & Audio Soundscape ─── */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Left: 24 Virtues of Ashoka Chakra Interactive Explorer */}
        <div className="apple-glass rounded-[2rem] p-7 relative overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                <AshokaChakra size={22} color="#3b82f6" animate={true} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-wide">
                  24 Spokes of Dharma Chakra
                </h4>
                <p className="text-[11px] text-slate-400">
                  Click any virtue to inspect its constitutional philosophy
                </p>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-blue-300 px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/25">
              Spoke #{selectedVirtue.spoke}
            </span>
          </div>

          {/* Virtue Spoke Chips */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-5">
            {CHAKRA_VIRTUES.map((item) => (
              <button
                key={item.spoke}
                type="button"
                onClick={() => setSelectedVirtue(item)}
                className={`apple-btn text-left p-2.5 rounded-xl border text-[11px] transition-all ${
                  selectedVirtue.spoke === item.spoke
                    ? "bg-blue-500/20 border-blue-400 text-white shadow-sm ring-1 ring-blue-400/50 scale-[1.02]"
                    : "bg-slate-950/60 border-white/10 text-slate-300 hover:border-white/20 hover:bg-slate-900"
                }`}
              >
                <div className="font-bold truncate">{item.name.split(" ")[0]}</div>
                <div className="text-[9px] text-slate-400">Spoke {item.spoke}</div>
              </button>
            ))}
          </div>

          {/* Selected Virtue Insight Callout */}
          <div className="rounded-2xl bg-blue-950/40 border border-blue-400/25 p-4 text-slate-200">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-300 mb-1">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span>{selectedVirtue.name}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              "{selectedVirtue.desc}"
            </p>
            <div className="mt-2 text-[10px] text-slate-400">
              Inscribed from the Lion Capital of Emperor Ashoka at Sarnath (3rd Century BCE).
            </div>
          </div>
        </div>

        {/* Right: National Audio Soundscape & Music Suite */}
        <div className="apple-glass rounded-[2rem] p-7 flex flex-col justify-between relative overflow-hidden shadow-2xl">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                  <Volume2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-wide">
                    Patriotic Soundscape Suite
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Vande Mataram Master Instrumental &amp; Doordarshan Shehnai
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-amber-300 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/25">
                Audio Live
              </span>
            </div>

            {/* Dynamic Live Equalizer Waveform */}
            <div className="my-6 p-5 rounded-2xl bg-slate-950/70 border border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-end gap-1.5 h-12">
                {[
                  { dur: "0.8s", min: 8, max: 40 },
                  { dur: "1.2s", min: 14, max: 48 },
                  { dur: "0.6s", min: 10, max: 32 },
                  { dur: "1.0s", min: 18, max: 44 },
                  { dur: "1.4s", min: 12, max: 46 },
                  { dur: "0.9s", min: 16, max: 38 },
                  { dur: "1.1s", min: 10, max: 42 },
                  { dur: "0.7s", min: 20, max: 48 },
                  { dur: "1.3s", min: 14, max: 36 },
                  { dur: "0.85s", min: 12, max: 44 },
                  { dur: "1.05s", min: 16, max: 40 },
                  { dur: "0.95s", min: 10, max: 35 },
                ].map((bar, i) => (
                  <div
                    key={i}
                    className={`w-1.5 rounded-full transition-all duration-300 ${
                      isPlaying
                        ? "bg-gradient-to-t from-amber-500 via-orange-400 to-emerald-400 animate-pulse"
                        : "bg-slate-700/60"
                    }`}
                    style={{
                      height: isPlaying ? undefined : "12px",
                      animationDuration: bar.dur,
                    }}
                  />
                ))}
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-white">Vande Mataram</div>
                <div className="text-[10px] text-amber-300 font-medium">Bankim Chandra Chatterjee</div>
                <div className="text-[9px] text-slate-500 mt-0.5">Mastered 48kHz Stereo</div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onTogglePlay}
              className="apple-btn flex-1 flex items-center justify-center gap-2 rounded-full py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-emerald-400 hover:brightness-110 shadow-lg active:scale-95"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5 fill-current" />
                  <span>Pause Music</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Play Vande Mataram</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onFireCelebration}
              className="apple-btn px-4 py-2.5 rounded-full text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 transition active:scale-95"
            >
              Fanfare Chime
            </button>
          </div>
        </div>
      </div>

      {/* ─── Row 3: Interactive Azadi Sankalp (Pledge for the Nation) ─── */}
      <div
        className="apple-glass rounded-[2.25rem] p-8 sm:p-10 relative overflow-hidden shadow-2xl border border-amber-400/30"
        style={{
          background: "linear-gradient(165deg, rgba(17, 24, 39, 0.9) 0%, rgba(8, 14, 28, 0.98) 100%)",
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#046A38]" />

        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-4">
            <Shield className="h-3.5 w-3.5 text-emerald-400" />
            <span>National Sovereignty &amp; Unity Pledge (आज़ादी का संकल्प)</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white font-serif mb-4">
            A Solemn Vow to Mother India
          </h3>

          <blockquote className="italic leading-relaxed text-sm sm:text-base text-slate-200 font-serif bg-white/[0.03] border border-white/10 p-6 rounded-2xl mb-6 shadow-inner">
            "I solemnly pledge my devotion to the sovereignty, unity, and progress of India. I shall honor our freedom fighters by uplifting my fellow citizens, cherishing our rich diversity, and dedicating my efforts to the peace, honor, and prosperity of our motherland."
          </blockquote>

          {hasPledged ? (
            <div className="py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-blue-500/20 border border-amber-400/40 text-amber-200 font-bold text-sm shadow-lg flex flex-col items-center justify-center gap-2 animate-float">
              <div className="flex items-center gap-2 text-base text-white">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span>Pledge Sealed with Pride by {senderName || "Proud Citizen of India"}!</span>
              </div>
              <div className="text-xs text-amber-300 font-medium">
                Commemorating the {targetYear} Indian Independence Day Celebration · Jai Hind 🇮🇳
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleTakePledge}
              className="apple-btn inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-white to-emerald-400 hover:brightness-110 shadow-xl active:scale-95 transition-transform"
            >
              <Award className="h-4 w-4 text-amber-900" />
              <span>Seal My Independence Day Pledge 🇮🇳</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default NationalPrideShowcase;
