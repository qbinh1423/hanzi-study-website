"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  X,
  RotateCcw,
  Pencil,
  Volume2,
  Eye,
  EyeOff,
  BookOpen,
} from "lucide-react";

const CHAR_DECOMPOSITION_MAP: Record<
  string,
  { pinyin: string; radical: string; radicalName: string; strokes: number; meaning: string }
> = {
  爱: {
    pinyin: "ài",
    radical: "爫",
    radicalName: "Claw radical",
    strokes: 10,
    meaning: "To love, affection",
  },
  好: {
    pinyin: "hǎo",
    radical: "女",
    radicalName: "Woman radical",
    strokes: 6,
    meaning: "Good, fine, fond of",
  },
  学: {
    pinyin: "xué",
    radical: "子",
    radicalName: "Child radical",
    strokes: 8,
    meaning: "To study, learn",
  },
  习: {
    pinyin: "xí",
    radical: "羽",
    radicalName: "Feather radical",
    strokes: 3,
    meaning: "To practice, habit",
  },
  朋: {
    pinyin: "péng",
    radical: "月",
    radicalName: "Moon radical",
    strokes: 8,
    meaning: "Friend, companion",
  },
  友: {
    pinyin: "yǒu",
    radical: "又",
    radicalName: "Right hand / Again radical",
    strokes: 4,
    meaning: "Friend, friendly",
  },
};

type HandwritingModalProps = {
  hanzi: string;
  type: string;
  onClose: () => void;
};

type HanziWriterInstance = {
  animateCharacter: (options?: { onComplete?: () => void }) => void;
  showCharacter: () => void;
  hideCharacter: () => void;
  showOutline: () => void;
  hideOutline: () => void;
  cancelQuiz: () => void;
  quiz: (options: {
    showOutline?: boolean;
    onCorrectStroke?: (data: { strokesRemaining: number; totalMistakes: number }) => void;
    onComplete?: (summary: { totalMistakes: number }) => void;
  }) => void;
};

export default function HandwritingModal({
  hanzi,
  type,
  onClose,
}: HandwritingModalProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriterInstance | null>(null);

  const characters = useMemo(() => Array.from(hanzi), [hanzi]);
  const [selectedCharIndex, setSelectedCharIndex] = useState(0);
  const currentChar = characters[selectedCharIndex] || characters[0];

  const [mode, setMode] = useState<"demo" | "quiz">("demo");
  const [showOutline, setShowOutline] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const [canvasSize, setCanvasSize] = useState(260);

  const charInfo = CHAR_DECOMPOSITION_MAP[currentChar] || {
    pinyin: "",
    radical: "—",
    radicalName: "Updating...",
    strokes: 0,
    meaning: "",
  };

  const playCharAudio = useCallback(() => {
    if ("speechSynthesis" in window && currentChar) {
      const utterance = new SpeechSynthesisUtterance(currentChar);
      utterance.lang = "zh-CN";
      window.speechSynthesis.speak(utterance);
    }
  }, [currentChar]);

  const handleSelectChar = (index: number) => {
    setSelectedCharIndex(index);
    setIsLoaded(false);
    setMode("demo");
  };

  useEffect(() => {
    let cancelled = false;

    if (targetRef.current) {
      targetRef.current.innerHTML = "";
    }

    import("hanzi-writer").then((mod) => {
      if (cancelled || !targetRef.current || !currentChar) return;
      const HanziWriter = mod.default;

      try {
        const writer = HanziWriter.create(targetRef.current, currentChar, {
          width: canvasSize,
          height: canvasSize,
          padding: canvasSize <= 220 ? 20 : 26,
          showOutline: true,
          strokeAnimationSpeed: 1,
          delayBetweenStrokes: 180,
          outlineColor: "#E2E8F0",
          drawingColor: "#3B82F6", // Màu của nét bút khi đang rê tay vẽ
          drawingWidth: canvasSize <= 240 ? 18 : 22,
          showHintAfterMisses: 2, // Gợi ý nếu viết sai 2 lần
          onLoadCharDataSuccess: () => {
            if (!cancelled) setIsLoaded(true);
          },
          onLoadCharDataError: () => {
            if (!cancelled) setIsLoaded(false);
          },
        });

        writerRef.current = writer;
        writer.animateCharacter();
      } catch (err) {
        console.error("Error HanziWriter:", err);
      }
    });

    return () => {
      cancelled = true;
      if (writerRef.current) {
        writerRef.current.cancelQuiz();
      }
      writerRef.current = null;
    };
  }, [currentChar, canvasSize]);

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 360) {
        setCanvasSize(220);
      } else if (window.innerWidth < 400) {
        setCanvasSize(240);
      } else {
        setCanvasSize(260);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleShowDemo = useCallback(() => {
    if (!writerRef.current || !isLoaded) return;
    setMode("demo");
    writerRef.current.cancelQuiz();
    writerRef.current.showOutline();
    writerRef.current.showCharacter();
    writerRef.current.animateCharacter();
  }, [isLoaded]);

  const handleStartQuiz = useCallback(
    (outlineVisible = showOutline) => {
      if (!writerRef.current || !isLoaded) return;
      setMode("quiz");

      writerRef.current.cancelQuiz();
      writerRef.current.hideCharacter();

      if (outlineVisible) {
        writerRef.current.showOutline();
      } else {
        writerRef.current.hideOutline();
      }

      writerRef.current.quiz({
        showOutline: outlineVisible,
      });
    },
    [isLoaded, showOutline]
  );

  const handleToggleOutline = () => {
    const nextState = !showOutline;
    setShowOutline(nextState);
    if (mode === "quiz") {
      handleStartQuiz(nextState);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.25 }}
        className="relative z-10 w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center"
      >
        <div className="w-full flex items-center justify-between mb-2">
          <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-brand-500 dark:text-emerald-400 rounded-lg text-xs font-bold">
            {type}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {characters.length > 1 && (
          <div className="flex items-center gap-2 mb-3 p-1 bg-gray-100 dark:bg-gray-800/80 rounded-2xl">
            {characters.map((char, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectChar(index)}
                className={`px-5 py-1.5 rounded-xl font-serif font-bold text-lg transition-all flex items-center gap-1.5 ${
                  selectedCharIndex === index
                    ? "bg-brand-500 text-white shadow-sm scale-100"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span>{char}</span>
                {CHAR_DECOMPOSITION_MAP[char]?.pinyin && (
                  <span className="text-xs font-sans font-normal opacity-80">
                    ({CHAR_DECOMPOSITION_MAP[char].pinyin})
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        <div className="w-full bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-2.5 sm:p-3 mb-3 sm:mb-4 border border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-[11px] sm:text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div>
              <p className="font-bold text-gray-800 dark:text-gray-200">
                Radical: <span className="text-brand-500 font-serif">{charInfo.radical}</span> ({charInfo.radicalName})
              </p>
              <p className="text-gray-500 dark:text-gray-400 mt-0.5 text-[10px] sm:text-xs">
                {charInfo.meaning ? `Meaning: ${charInfo.meaning}` : "Component Analysis"}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="inline-block px-1.5 sm:px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md font-bold text-[10px] sm:text-xs">
              {charInfo.strokes > 0 ? `${charInfo.strokes} strokes` : "Standard"}
            </span>
          </div>
        </div>
        <div
          className="relative mx-auto rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-white"
          style={{ width: canvasSize, height: canvasSize }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, transparent calc(50% - 0.5px), #cbd5e1 calc(50% - 0.5px), #cbd5e1 calc(50% + 0.5px), transparent calc(50% + 0.5px)),
                linear-gradient(to bottom, transparent calc(50% - 0.5px), #cbd5e1 calc(50% - 0.5px), #cbd5e1 calc(50% + 0.5px), transparent calc(50% + 0.5px)),
                repeating-linear-gradient(45deg, transparent, transparent 6px, #f1f5f9 6px, #f1f5f9 7px),
                repeating-linear-gradient(-45deg, transparent, transparent 6px, #f1f5f9 6px, #f1f5f9 7px)
              `,
            }}
          />
          <div ref={targetRef} className="relative z-10" />
          <button
            type="button"
            onClick={playCharAudio}
            title="Play audio for this character"
            className="absolute bottom-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center transition-all shadow-xs"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
              Loading stroke data...
            </div>
          )}
        </div>
        <div className="w-full flex justify-end mt-1 mb-3">
          <button
            type="button"
            onClick={handleToggleOutline}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-1 transition-colors"
          >
            {showOutline ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-red-500" />}
            <span>{showOutline ? "Outline: On" : "Outline: Off (Difficult)"}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full">
          <button
            type="button"
            disabled={!isLoaded}
            onClick={handleShowDemo}
            className={`py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 ${
              mode === "demo"
                ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
                : "bg-emerald-50 dark:bg-emerald-500/10 text-brand-500 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20"
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>View Demo</span>
          </button>

          <button
            type="button"
            disabled={!isLoaded}
            onClick={() => handleStartQuiz(showOutline)}
            className={`py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 ${
              mode === "quiz"
                ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
                : "bg-emerald-50 dark:bg-emerald-500/10 text-brand-500 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20"
            }`}
          >
            <Pencil className="w-4 h-4" />
            <span>Practice Writing</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}