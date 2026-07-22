"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import {
  MessageCircle, X, ChevronDown, ChevronLeft, Bot, Sparkles,
  MapPin, Phone, Mail, Clock, ExternalLink, RotateCcw,
} from "lucide-react";

// ─── WhatsApp SVG ─────────────────────────────────────────────────────────────
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────
const WA_NUMBER = "919876543210"; // ← Replace with your real number
const WA_GREETING = encodeURIComponent("Hi! I'm interested in a trip with Nomadic Ventures. Can you help?");
const EMAIL = "hello@nomadicventures.com"; // ← Replace
const PHONE = "+94 XXX XXX XXX"; // ← Replace
const ADDRESS = "Colombo, Sri Lanka"; // ← Replace
const HOURS = "Mon – Sat, 9am – 6pm (IST)"; // ← Replace
const ABOUT_BLURB = "Nomadic Ventures crafts extraordinary journeys across Sri Lanka and the Maldives — blending curated luxury with authentic local experiences. We believe travel should leave a meaningful mark.";

// ─── Types ────────────────────────────────────────────────────────────────────
type StepId =
  | "WELCOME"
  | "MAIN_MENU"
  | "TOUR_CATEGORIES"
  | "TOUR_LIST"
  | "RESORT_CATEGORIES"
  | "RESORT_LIST"
  | "EXP_LIST"
  | "CONTACT"
  | "ABOUT";

type ChatData = {
  tourCategories: { id: string; name: string; slug: string; tours: TourItem[] }[];
  resortCategories: { id: string; name: string; slug: string; resorts: ResortItem[] }[];
  experiences: ExpItem[];
};
type TourItem = { id: string; name: string; slug: string; days: string; price: string; heroImage: string | null };
type ResortItem = { id: string; name: string; slug: string; location: string; price: string; heroImage: string | null };
type ExpItem = { id: string; title: string; slug: string; tagline: string; locationCountry: string; heroImage: string | null };

type Message = {
  id: string;
  role: "bot" | "user";
  content: MessageContent;
};

type MessageContent =
  | { type: "text"; text: string }
  | { type: "menu"; items: MenuItem[] }
  | { type: "card-list"; items: CardItem[] }
  | { type: "contact" }
  | { type: "about" };

type MenuItem = { label: string; icon: string; action: () => void };
type CardItem = { id: string; name: string; sub: string; image: string | null; action: () => void };

// ─── Keyword fallback ─────────────────────────────────────────────────────────
function keywordStep(text: string): StepId | null {
  const t = text.toLowerCase();
  if (/maldives|resort/.test(t)) return "RESORT_CATEGORIES";
  if (/sri lanka|tour|journey/.test(t)) return "TOUR_CATEGORIES";
  if (/experience/.test(t)) return "EXP_LIST";
  if (/contact|phone|email|address/.test(t)) return "CONTACT";
  if (/about|who are/.test(t)) return "ABOUT";
  if (/help|menu|home|start/.test(t)) return "MAIN_MENU";
  return null;
}

// ─── Persistent footer chips ──────────────────────────────────────────────────
function PersistentFooter() {
  return (
    <div className="flex gap-2 px-4 pb-3 pt-1">
      <a
        href={`https://wa.me/${WA_NUMBER}?text=${WA_GREETING}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-medium transition-all hover:opacity-80 flex-1 justify-center"
        style={{ background: "#25D366", fontSize: 11 }}
      >
        <WhatsAppIcon className="w-3.5 h-3.5" /> WhatsApp Us
      </a>
      <a
        href={`mailto:${EMAIL}`}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:opacity-80 flex-1 justify-center"
        style={{ background: "rgba(137,243,255,0.12)", color: "#89F3FF", border: "1px solid rgba(137,243,255,0.25)", fontSize: 11 }}
      >
        <Mail className="w-3.5 h-3.5" /> Email Us
      </a>
    </div>
  );
}

// ─── Card Item ────────────────────────────────────────────────────────────────
function CardChip({ item, onNavigate }: { item: CardItem; onNavigate: () => void }) {
  const FALLBACK = "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400";
  return (
    <motion.button
      whileHover={{ x: 3 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => { item.action(); onNavigate(); }}
      className="w-full flex items-center gap-3 p-3 rounded-xl text-left group transition-all"
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(137,243,255,0.12)" }}
    >
      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={item.image || FALLBACK}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-white text-sm font-medium truncate" style={{ fontFamily: "'Clash Display', sans-serif" }}>{item.name}</div>
        <div className="text-white/50 text-xs mt-0.5 truncate">{item.sub}</div>
      </div>
      <ExternalLink className="w-3.5 h-3.5 text-white/30 group-hover:text-[#89F3FF] transition-colors flex-shrink-0" />
    </motion.button>
  );
}

// ─── Markdown-lite renderer — converts **bold** to <strong> ─────────────────
function renderText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>
  );
}

// ─── Message Renderer ─────────────────────────────────────────────────────────
function BotMessage({ message }: { message: Message }) {
  const content = message.content;

  if (content.type === "text") {
    return (
      <div className="flex gap-2">
        <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-1" style={{ background: "rgba(137,243,255,0.15)" }}>
          <Sparkles className="w-3.5 h-3.5" style={{ color: "#89F3FF" }} />
        </div>
        <div className="max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.88)", border: "1px solid rgba(255,255,255,0.08)", borderBottomLeftRadius: 6 }}>
          {renderText(content.text)}
        </div>
      </div>
    );
  }

  if (content.type === "menu") {
    return (
      <div className="flex gap-2">
        <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-1" style={{ background: "rgba(137,243,255,0.15)" }}>
          <Sparkles className="w-3.5 h-3.5" style={{ color: "#89F3FF" }} />
        </div>
        <div className="flex flex-col gap-1.5 max-w-[85%]">
          {content.items.map((item, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
              onClick={item.action}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-left transition-all group"
              style={{ background: "rgba(137,243,255,0.07)", border: "1px solid rgba(137,243,255,0.18)", color: "rgba(255,255,255,0.85)" }}
            >
              <span className="text-base">{item.icon}</span>
              <span className="text-sm flex-1">{item.label}</span>
              <ChevronLeft className="w-3.5 h-3.5 text-white/30 group-hover:text-[#89F3FF] rotate-180 transition-colors" />
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  if (content.type === "card-list") {
    return (
      <div className="flex gap-2 w-full">
        <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-1" style={{ background: "rgba(137,243,255,0.15)" }}>
          <Sparkles className="w-3.5 h-3.5" style={{ color: "#89F3FF" }} />
        </div>
        <div className="flex flex-col gap-2 flex-1">
          {content.items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <CardChip item={item} onNavigate={() => {}} />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (content.type === "contact") {
    return (
      <div className="flex gap-2">
        <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-1" style={{ background: "rgba(137,243,255,0.15)" }}>
          <Sparkles className="w-3.5 h-3.5" style={{ color: "#89F3FF" }} />
        </div>
        <div className="rounded-2xl p-4 flex-1 space-y-3" style={{ background: "rgba(137,243,255,0.07)", border: "1px solid rgba(137,243,255,0.2)" }}>
          <div className="text-white font-semibold text-sm mb-3" style={{ fontFamily: "'Clash Display', sans-serif" }}>Get In Touch</div>
          {[
            { icon: <MapPin className="w-3.5 h-3.5" />, label: ADDRESS },
            { icon: <Phone className="w-3.5 h-3.5" />, label: PHONE },
            { icon: <Mail className="w-3.5 h-3.5" />, label: EMAIL },
            { icon: <Clock className="w-3.5 h-3.5" />, label: HOURS },
          ].map((row, i) => (
            <div key={i} className="flex items-center gap-2.5 text-xs text-white/75">
              <span style={{ color: "#89F3FF" }}>{row.icon}</span>
              {row.label}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (content.type === "about") {
    return (
      <div className="flex gap-2">
        <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-1" style={{ background: "rgba(137,243,255,0.15)" }}>
          <Sparkles className="w-3.5 h-3.5" style={{ color: "#89F3FF" }} />
        </div>
        <div className="rounded-2xl p-4 flex-1" style={{ background: "rgba(137,243,255,0.07)", border: "1px solid rgba(137,243,255,0.2)" }}>
          <div className="text-white font-semibold text-sm mb-2" style={{ fontFamily: "'Clash Display', sans-serif" }}>About Us</div>
          <p className="text-white/70 text-xs leading-relaxed">{ABOUT_BLURB}</p>
        </div>
      </div>
    );
  }

  return null;
}

// ─── User Message ─────────────────────────────────────────────────────────────
function UserMessage({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed font-medium" style={{ background: "linear-gradient(135deg, #89F3FF 0%, #4db8cc 100%)", color: "#021830", borderBottomRightRadius: 6 }}>
        {text}
      </div>
    </div>
  );
}

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
function SkeletonLoader() {
  return (
    <div className="space-y-3 px-4">
      {[80, 60, 90].map((w, i) => (
        <div key={i} className="flex gap-2">
          <div className="w-7 h-7 rounded-xl flex-shrink-0" style={{ background: "rgba(137,243,255,0.1)" }} />
          <div className="h-9 rounded-xl animate-pulse" style={{ width: `${w}%`, background: "rgba(255,255,255,0.06)" }} />
        </div>
      ))}
    </div>
  );
}

// ─── Main Chatbot Widget ──────────────────────────────────────────────────────
function ChatbotWidget({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [historyStack, setHistoryStack] = useState<StepId[]>([]);
  const [isOnWelcome, setIsOnWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  }, [messages]);

  // Suppress pulse on open
  useEffect(() => {
    if (open) setShowPulse(false);
  }, [open]);

  // ─── Navigation helper ──────────────────────────────────────────────────────
  const navigateTo = useCallback((path: string) => {
    router.push(path);
    setOpen(false);
  }, [router]);

  // ─── Add message helpers ────────────────────────────────────────────────────
  const addBotMsg = useCallback((content: MessageContent) => {
    setMessages((prev) => [...prev, { id: Date.now().toString() + Math.random(), role: "bot", content }]);
  }, []);

  // ─── Reset to beginning ──────────────────────────────────────────────────────
  const resetChat = useCallback((data: ChatData) => {
    setMessages([]);
    setHistoryStack([]);
    setIsOnWelcome(false);
    setTimeout(() => {
      addBotMsg({ type: "text", text: "👋 Welcome back! How can I help you today? Choose an option below 👇" });
      addBotMsg({
        type: "menu",
        items: [
          { label: "Sri Lanka Journeys", icon: "🌿", action: () => goToTourCategories(data) },
          { label: "Maldives Resorts", icon: "🌊", action: () => goToResortCategories(data) },
          { label: "Experiences", icon: "✨", action: () => goToExpList(data) },
          { label: "Contact Us", icon: "📞", action: () => goToContact() },
          { label: "About Us", icon: "ℹ️", action: () => goToAbout(data) },
        ],
      });
    }, 50);
  }, [addBotMsg]); // eslint-disable-line

  // ─── Step renderers ─────────────────────────────────────────────────────────
  const goToMainMenu = useCallback((data: ChatData) => {
    setHistoryStack([]);
    setIsOnWelcome(false);
    addBotMsg({ type: "text", text: "How can I help you today? Choose an option below 👇" });
    addBotMsg({
      type: "menu",
      items: [
        { label: "Sri Lanka Journeys", icon: "🌿", action: () => goToTourCategories(data) },
        { label: "Maldives Resorts", icon: "🌊", action: () => goToResortCategories(data) },
        { label: "Experiences", icon: "✨", action: () => goToExpList(data) },
        { label: "Contact Us", icon: "📞", action: () => goToContact() },
        { label: "About Us", icon: "ℹ️", action: () => goToAbout(data) },
      ],
    });
  }, []); // eslint-disable-line

  const goBack = useCallback((data: ChatData) => {
    setHistoryStack((prev) => {
      const newStack = [...prev];
      const current = newStack.pop();
      const previous = newStack[newStack.length - 1] || "MAIN_MENU";
      // Re-render previous step
      setMessages([]);
      setTimeout(() => {
        if (previous === "MAIN_MENU") goToMainMenu(data);
        else if (previous === "TOUR_CATEGORIES") goToTourCategories(data);
        else if (previous === "RESORT_CATEGORIES") goToResortCategories(data);
        else if (previous === "EXP_LIST") goToExpList(data);
        else if (previous === "CONTACT") goToContact();
        else if (previous === "ABOUT") goToAbout(data);
      }, 50);
      return newStack;
    });
  }, []); // eslint-disable-line

  const backItem = useCallback((data: ChatData): MenuItem => ({
    label: "← Back",
    icon: "↩",
    action: () => goBack(data),
  }), [goBack]);

  const goToTourCategories = useCallback((data: ChatData) => {
    setHistoryStack((p) => [...p, "TOUR_CATEGORIES"]);
    addBotMsg({ type: "text", text: "🌿 Here are our Sri Lanka journey collections — choose one to explore:" });
    addBotMsg({
      type: "menu",
      items: [
        backItem(data),
        ...data.tourCategories.map((cat) => ({
          label: cat.name,
          icon: "🗺️",
          action: () => goToTourList(data, cat.id),
        })),
      ],
    });
  }, [addBotMsg, backItem]); // goToTourCategories

  const goToTourList = useCallback((data: ChatData, catId: string) => {
    const cat = data.tourCategories.find((c) => c.id === catId);
    if (!cat) return;
    setHistoryStack((p) => [...p, "TOUR_LIST"]);
    addBotMsg({ type: "text", text: `🌿 Here are the journeys in **${cat.name}**:` });
    addBotMsg({
      type: "menu",
      items: [backItem(data), { label: "Start Over", icon: "🔄", action: () => resetChat(data) }],
    });
    addBotMsg({
      type: "card-list",
      items: cat.tours.map((t) => ({
        id: t.id,
        name: t.name,
        sub: `${t.days ? t.days + " Days · " : ""}From ${t.price}`,
        image: t.heroImage,
        action: () => navigateTo(`/tours/${t.slug}`),
      })),
    });
  }, [addBotMsg, backItem, navigateTo, resetChat]);

  const goToResortCategories = useCallback((data: ChatData) => {
    setHistoryStack((p) => [...p, "RESORT_CATEGORIES"]);
    addBotMsg({ type: "text", text: "🌊 Choose a Maldives resort collection:" });
    addBotMsg({
      type: "menu",
      items: [
        backItem(data),
        { label: "Start Over", icon: "🔄", action: () => resetChat(data) },
        ...data.resortCategories.map((cat) => ({
          label: cat.name,
          icon: "🏝️",
          action: () => goToResortList(data, cat.id),
        })),
      ],
    });
  }, [addBotMsg, backItem, resetChat]);

  const goToResortList = useCallback((data: ChatData, catId: string) => {
    const cat = data.resortCategories.find((c) => c.id === catId);
    if (!cat) return;
    setHistoryStack((p) => [...p, "RESORT_LIST"]);
    addBotMsg({ type: "text", text: `🏝️ Here are resorts in **${cat.name}**:` });
    addBotMsg({ type: "menu", items: [backItem(data), { label: "Start Over", icon: "🔄", action: () => resetChat(data) }] });
    addBotMsg({
      type: "card-list",
      items: cat.resorts.map((r) => ({
        id: r.id,
        name: r.name,
        sub: `${r.location} · From $${r.price}`,
        image: r.heroImage,
        action: () => navigateTo(`/maldives-resort/${r.slug}`),
      })),
    });
  }, [addBotMsg, backItem, navigateTo, resetChat]);

  const goToExpList = useCallback((data: ChatData) => {
    setHistoryStack((p) => [...p, "EXP_LIST"]);
    addBotMsg({ type: "text", text: "✨ Here are our curated experiences:" });
    addBotMsg({ type: "menu", items: [backItem(data), { label: "Start Over", icon: "🔄", action: () => resetChat(data) }] });
    addBotMsg({
      type: "card-list",
      items: data.experiences.map((e) => ({
        id: e.id,
        name: e.title,
        sub: e.tagline || e.locationCountry,
        image: e.heroImage,
        action: () => navigateTo(`/experiences/${e.slug}`),
      })),
    });
  }, [addBotMsg, backItem, navigateTo, resetChat]);

  const goToContact = useCallback(() => {
    setHistoryStack((p) => [...p, "CONTACT"]);
    addBotMsg({ type: "text", text: "📞 Here's how to reach us:" });
    addBotMsg({ type: "contact" });
    // Start Over added via chatData reference in goToAbout/goToContact - injected after data available
  }, [addBotMsg]);

  const goToAbout = useCallback((data: ChatData) => {
    setHistoryStack((p) => [...p, "ABOUT"]);
    addBotMsg({ type: "about" });
    addBotMsg({
      type: "menu",
      items: [
        { label: "← Back to Menu", icon: "↩", action: () => { setMessages([]); setTimeout(() => goToMainMenu(data), 50); } },
        { label: "Start Over", icon: "🔄", action: () => resetChat(data) },
        { label: "Explore Journeys", icon: "🌿", action: () => goToTourCategories(data) },
        { label: "Maldives Resorts", icon: "🌊", action: () => goToResortCategories(data) },
      ],
    });
  }, [addBotMsg, goToMainMenu, goToTourCategories, goToResortCategories, resetChat]); // eslint-disable-line

  // ─── Fetch data & show welcome ──────────────────────────────────────────────
  const initChat = useCallback(async () => {
    if (chatData) {
      resetChat(chatData);
      return;
    }
    setMessages([]);
    setIsOnWelcome(true);
    setLoading(true);
    addBotMsg({ type: "text", text: "👋 Hi! Welcome to **Nomadic Ventures**! I'm **Nova**, your personal travel assistant. Let me load our latest packages for you..." });
    try {
      const res = await fetch("/api/chatbot/data");
      const json = await res.json();
      if (json.success) {
        setChatData(json);
        setLoading(false);
        setIsOnWelcome(false);
        setTimeout(() => goToMainMenu(json), 300);
      } else {
        setLoading(false);
        addBotMsg({ type: "text", text: "Hmm, I had trouble fetching our latest data. Please try again or reach us via WhatsApp!" });
      }
    } catch {
      setLoading(false);
      addBotMsg({ type: "text", text: "Network issue! Please try WhatsApp or email us directly." });
    }
  }, [chatData, addBotMsg, goToMainMenu, resetChat]);

  const handleOpen = () => {
    setOpen(true);
    if (messages.length === 0) initChat();
  };

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-[80px] right-0 flex flex-col rounded-3xl overflow-hidden shadow-2xl"
            style={{
              width: 360,
              height: 560,
              background: "linear-gradient(145deg, #0d1b2a 0%, #0a1628 100%)",
              border: "1px solid rgba(137,243,255,0.18)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 40px rgba(137,243,255,0.08)",
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #1a3a5c 0%, #0d2640 100%)", borderBottom: "1px solid rgba(137,243,255,0.12)" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #89F3FF 0%, #4db8cc 100%)", boxShadow: "0 4px 15px rgba(137,243,255,0.35)" }}>
                <Bot className="w-5 h-5 text-[#021830]" />
              </div>
              <div className="flex-1">
                <div className="text-white font-semibold" style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 15 }}>Nova</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
                  <span className="text-white/50" style={{ fontSize: 11 }}>Nomadic Ventures · Online</span>
                </div>
              </div>
              {/* Refresh / restart button */}
              {chatData && (
                <motion.button
                  whileHover={{ rotate: -180 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.35 }}
                  onClick={() => resetChat(chatData)}
                  title="Start Over"
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-[#89F3FF] hover:bg-white/10 transition-colors mr-1"
                >
                  <RotateCcw className="w-4 h-4" />
                </motion.button>
              )}
              <button onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ scrollbarWidth: "none" }}>
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                    {msg.role === "bot"
                      ? <BotMessage message={msg} />
                      : <UserMessage text={(msg.content as { type: "text"; text: string }).text} />
                    }
                  </motion.div>
                ))}
              </AnimatePresence>
              {loading && <SkeletonLoader />}
              <div ref={messagesEndRef} />
            </div>

            {/* Persistent Footer — WhatsApp + Email always visible */}
            <div className="flex-shrink-0" style={{ borderTop: "1px solid rgba(137,243,255,0.08)" }}>
              <PersistentFooter />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        id="chatbot-fab"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => open ? setOpen(false) : handleOpen()}
        className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
        style={{
          background: open ? "linear-gradient(135deg, #1a3a5c, #0d2640)" : "linear-gradient(135deg, #89F3FF 0%, #4db8cc 100%)",
          border: "1px solid rgba(137,243,255,0.3)",
          boxShadow: "0 8px 30px rgba(137,243,255,0.35)",
        }}
        title="Chat with Nova"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X className="w-6 h-6 text-[#89F3FF]" />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageCircle className="w-6 h-6 text-[#021830]" />
            </motion.span>
          )}
        </AnimatePresence>
        {showPulse && !open && (
          <>
            <motion.span className="absolute inset-0 rounded-full" style={{ border: "2px solid rgba(137,243,255,0.5)" }}
              animate={{ scale: [1, 1.5], opacity: [0.8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white" style={{ background: "#ef4444", fontSize: 9 }}>1</span>
          </>
        )}
      </motion.button>
    </>
  );
}

// ─── WhatsApp Widget ──────────────────────────────────────────────────────────
function WhatsAppWidget() {
  const [hovered, setHovered] = useState(false);
  const openWhatsApp = () => window.open(`https://wa.me/${WA_NUMBER}?text=${WA_GREETING}`, "_blank");

  return (
    <div className="flex items-center gap-3">
      <motion.button
        id="whatsapp-fab"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onClick={openWhatsApp}
        className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl flex-shrink-0"
        style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)", boxShadow: "0 8px 30px rgba(37,211,102,0.4)" }}
        title="WhatsApp"
      >
        <WhatsAppIcon className="w-7 h-7 text-white" />
        <motion.span className="absolute inset-0 rounded-full" style={{ border: "2px solid rgba(37,211,102,0.5)" }}
          animate={{ scale: [1, 1.5], opacity: [0.8, 0] }} transition={{ duration: 1.8, repeat: Infinity }} />
      </motion.button>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: -6, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -6, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="whitespace-nowrap px-4 py-2 rounded-xl font-medium shadow-xl pointer-events-none"
            style={{ background: "#25D366", color: "#fff", fontSize: 13, boxShadow: "0 8px 24px rgba(37,211,102,0.35)" }}
          >
            Chat on WhatsApp
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Root Export ──────────────────────────────────────────────────────────────
export function FloatingWidgets() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 left-0 right-0 z-[9999] pointer-events-none">
      <div className="max-w-none mx-auto relative flex justify-between items-end px-6">
        <div className="pointer-events-auto">
          <WhatsAppWidget />
        </div>
        <div className="pointer-events-auto relative flex flex-col items-end">
          <ChatbotWidget />
        </div>
      </div>
    </div>
  );
}
