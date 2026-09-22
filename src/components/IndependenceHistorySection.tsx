import React, { useState } from "react";
import {
  Calendar,
  BookOpen,
  Award,
  Sparkles,
  Flame,
  Volume2,
  Wind,
  ExternalLink,
  ChevronRight,
  Landmark,
  Compass,
} from "lucide-react";
import RedFortSilhouette from "./RedFortSilhouette";

interface TimelineMilestone {
  year: string;
  date: string;
  title: string;
  summary: string;
  detail: string;
  badge: string;
}

const TIMELINE: TimelineMilestone[] = [
  {
    year: "1929–1930",
    date: "26 January 1930",
    title: "Purna Swaraj Declaration",
    summary:
      "Hasrat Mohani first voiced 'Complete Independence' (Azadi-e-Kaamil); the Lahore Congress officially adopted the Purna Swaraj pledge.",
    detail:
      "Between 1930 and 1946, Indians observed 26 January as Independence Day with solemn peaceful assemblies and civil disobedience pledges. When freedom was won on 15 August 1947, 26 January was later commemorated as Republic Day upon the enactment of the Constitution in 1950.",
    badge: "The Pledge",
  },
  {
    year: "1947",
    date: "18 July 1947",
    title: "Indian Independence Act 1947",
    summary:
      "British Parliament enacted 10 & 11 Geo 6 c. 30, transferring supreme legislative sovereignty to the Constituent Assembly.",
    detail:
      "The Act partitioned British India into the independent dominions of India and Pakistan with effect from 15 August 1947, granting complete legislative and constitutional authority to the Indian Constituent Assembly.",
    badge: "Sovereignty",
  },
  {
    year: "1947",
    date: "14–15 August Midnight",
    title: "Tryst with Destiny Address",
    summary:
      "Jawaharlal Nehru addressed the fifth session of the Constituent Assembly at Constitution Hall, New Delhi.",
    detail:
      "'Long years ago we made a tryst with destiny, and now the time comes when we shall redeem our pledge... At the stroke of the midnight hour, when the world sleeps, India will awake to life and freedom.' A delegation representing the women of India formally presented the National Flag to the assembly.",
    badge: "Midnight Dawn",
  },
  {
    year: "1947",
    date: "15 August 1947",
    title: "First Flag Hoisting at Red Fort",
    summary:
      "The Tiranga was raised above Lahori Gate of Delhi's Red Fort, initiating a living national tradition.",
    detail:
      "Every subsequent Prime Minister customarily unfurls the national flag from the historic ramparts of the Red Fort, accompanied by a 21-gun salute, the national anthem Jana Gana Mana, and an address to the nation broadcast worldwide.",
    badge: "National Symbol",
  },
];

const TRADITIONS = [
  {
    icon: Landmark,
    title: "Red Fort Address & 21-Gun Salute",
    desc: "The Prime Minister unfurls the Tiranga from Lahori Gate ramparts, followed by a ceremonial 21-gun salute by the Indian Armed Forces and an address to the nation.",
    accent: "from-amber-500/20 to-orange-500/10 border-amber-400/30 text-amber-300",
  },
  {
    icon: Volume2,
    title: "Shehnai by Ustad Bismillah Khan",
    desc: "National broadcasts by Doordarshan have historically opened with the sacred shehnai melodies of Bharat Ratna Ustad Bismillah Khan, an enduring symbol of harmony.",
    accent: "from-blue-500/20 to-indigo-500/10 border-blue-400/30 text-blue-300",
  },
  {
    icon: Wind,
    title: "Kite Flying (Patangbaazi)",
    desc: "Skies across Delhi, Punjab, and North India fill with thousands of colorful fighter kites (Patang), an exuberant cultural tradition symbolizing the boundless spirit of freedom.",
    accent: "from-emerald-500/20 to-teal-500/10 border-emerald-400/30 text-emerald-300",
  },
  {
    icon: Compass,
    title: "President's Eve Address",
    desc: "On the eve of Independence Day (14th August), the President of India delivers an inspiring address to the nation, honoring freedom fighters and outlining national progress.",
    accent: "from-purple-500/20 to-pink-500/10 border-purple-400/30 text-purple-300",
  },
];

const DID_YOU_KNOW = [
  {
    fact: "Mahatma Gandhi spent 15 August 1947 on a 24-hour fast in Calcutta.",
    explanation:
      "While Delhi celebrated with official ceremonies, Mahatma Gandhi abstained from events, staying in Calcutta praying and fasting to bring peace during the tragic communal violence of partition.",
  },
  {
    fact: "Women of India formally presented the National Flag at midnight.",
    explanation:
      "During the historic midnight assembly on 14 August 1947, a distinguished delegation representing all the women of India formally presented the Tiranga to the Constituent Assembly.",
  },
  {
    fact: "Lord Mountbatten selected 15th August for historic reasons.",
    explanation:
      "Lord Mountbatten advanced the date of power transfer from June 1948 to August 1947, picking 15 August because it was the second anniversary of Japan's surrender in World War II.",
  },
  {
    fact: "Pingali Venkayya designed the framework of the Tiranga.",
    explanation:
      "Freedom fighter Pingali Venkayya presented the flag design with saffron and green bands to Mahatma Gandhi in 1921. Later, a white stripe and Ashoka Chakra (Dharma Wheel) were incorporated.",
  },
];

export const IndependenceHistorySection: React.FC = () => {
  const [activeMilestone, setActiveMilestone] = useState<number>(2); // Default to Midnight speech

  return (
    <section className="mt-28 relative z-10 max-w-6xl mx-auto px-4">
      {/* Section Header with Apple Typography */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1 text-xs font-semibold text-amber-300 backdrop-blur-xl mb-3 shadow-inner">
          <BookOpen className="h-3.5 w-3.5 text-amber-400" />
          <span>Historical Chronicles · Sourced from Wikipedia</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-sans">
          The Chronicles of <span className="gold-shimmer-text font-serif">15 August 1947</span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Accurate historical facts, milestones, and living traditions commemorating India's sovereignty, as documented in the records of independence.
        </p>
      </div>

      {/* Interactive Milestone Timeline */}
      <div className="apple-glass rounded-3xl p-6 sm:p-8 mb-12 relative overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <Calendar className="h-5 w-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Milestones on the Road to Freedom
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase hidden sm:inline">
            1929 – 1947
          </span>
        </div>

        {/* Milestone Selection Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-6">
          {TIMELINE.map((m, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveMilestone(idx)}
              className={`apple-btn text-left p-3.5 rounded-2xl border transition-all ${
                activeMilestone === idx
                  ? "bg-amber-500/20 border-amber-400/60 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                  : "bg-slate-950/40 border-white/10 hover:border-white/20 hover:bg-slate-900/40"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-amber-300/90 mb-1">
                <span>{m.year}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/80 font-mono">
                  {m.badge}
                </span>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-white line-clamp-1">
                {m.title}
              </div>
            </button>
          ))}
        </div>

        {/* Active Milestone Card */}
        <div className="rounded-2xl bg-slate-950/60 border border-white/10 p-5 sm:p-7 relative overflow-hidden backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3 mb-4">
            <div>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
                {TIMELINE[activeMilestone].date}
              </span>
              <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5 font-sans">
                {TIMELINE[activeMilestone].title}
              </h4>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
              <Award className="h-3.5 w-3.5 text-amber-400" />
              Historical Record
            </span>
          </div>

          <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed mb-3">
            {TIMELINE[activeMilestone].summary}
          </p>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-serif italic border-l-2 border-amber-400/50 pl-3.5 my-3">
            "{TIMELINE[activeMilestone].detail}"
          </p>

          {activeMilestone === 2 && (
            <div className="mt-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-white/5 to-emerald-500/10 border border-amber-400/20 p-3.5 text-xs text-amber-200/90 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Delivered at the stroke of the midnight hour by Pt. Jawaharlal Nehru.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Living Traditions & Cultural Pageantry */}
      <div className="mb-12">
        <div className="text-center mb-6">
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Sacred Traditions &amp; National Observance
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Ceremonial customs observed every 15th August across all states and union territories.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TRADITIONS.map((t, i) => {
            const Icon = t.icon;
            return (
              <div
                key={i}
                className="apple-glass rounded-3xl p-5 relative overflow-hidden transition-all hover:scale-[1.02] flex flex-col"
              >
                <div
                  className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${t.accent} border flex items-center justify-center mb-3 shadow-md`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-white tracking-tight mb-1.5">
                  {t.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed flex-1">
                  {t.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Did You Know? / Verified Wikipedia Trivia */}
      <div className="apple-glass rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden">
        <div className="flex items-center gap-2.5 mb-6">
          <Flame className="h-5 w-5 text-amber-400" />
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Historical Insights &amp; Trivia
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DID_YOU_KNOW.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-slate-950/50 border border-white/10 p-4 transition-transform hover:translate-y-[-2px]"
            >
              <div className="flex items-start gap-2.5">
                <span className="text-base select-none mt-0.5">🇮🇳</span>
                <div>
                  <h5 className="text-xs sm:text-sm font-bold text-amber-300/90 mb-1">
                    {item.fact}
                  </h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.explanation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Wikipedia Link Attribution */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span>
            Verified with public records from the Government of India and Wikipedia archives.
          </span>
          <a
            href="https://en.wikipedia.org/wiki/Independence_Day_(India)"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold transition"
          >
            <span>Read full Wikipedia article</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Red Fort Silhouette Anchor */}
      <div className="mt-8 pt-4">
        <div className="text-center mb-2">
          <span className="text-[11px] font-bold tracking-[0.15em] text-slate-400 uppercase">
            Ramparts of Lal Qila (Red Fort) · Delhi
          </span>
        </div>
        <RedFortSilhouette flagAnimate={true} />
      </div>
    </section>
  );
};

export default IndependenceHistorySection;
