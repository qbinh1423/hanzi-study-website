"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  Lock,
  ChevronLeft,
  PenTool,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import HandwritingModal from "@/components/handwriting-modal";

type Rating = "again" | "hard" | "good" | "easy";

type Card = {
  id: number;
  hanzi: string;
  pinyin: string;
  meaning: string;
  type: string;
  example: string;
};

type HistoryEntry = {
  index: number;
  rating: Rating;
};

const SAMPLE_CARDS: Card[] = [
  {
    id: 1,
    hanzi: "爱好",
    pinyin: "ài hào",
    meaning: "Hobby / Interest",
    type: "HSK 1 · Noun/Verb",
    example:
      "爱 means love, 好 means fond of. Together they form.\nExample:  我有很多爱好  (I have many hobbies)",
  },
  {
    id: 2,
    hanzi: "学习",
    pinyin: "xué xí",
    meaning: "To study / To learn",
    type: "HSK 1 · Verb",
    example: "我喜欢学习汉语 (I like learning Chinese)",
  },
  {
    id: 3,
    hanzi: "朋友",
    pinyin: "péng you",
    meaning: "Friend",
    type: "HSK 1 · Noun",
    example: "他是我的好朋友 (He is my good friend)",
  },
];

const HSK_LEVELS = [
  { id: 1, label: "HSK1", locked: false },
  { id: 2, label: "HSK2", locked: false },
  { id: 3, label: "HSK3", locked: true },
  { id: 4, label: "HSK4", locked: true },
  { id: 5, label: "HSK5", locked: true },
  { id: 6, label: "HSK6", locked: true },
];

const EMPTY_STATS = { again: 0, hard: 0, good: 0, easy: 0 };

export default function FlashcardsPage() {
  const [selectedHsk, setSelectedHsk] = useState(1);
  const [sessionCards, setSessionCards] = useState<Card[]>(SAMPLE_CARDS);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const [stats, setStats] = useState(EMPTY_STATS);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const currentCard = sessionCards[currentIndex];
  const totalCards = sessionCards.length;

  const [showHandWriting, setShowHandWriting] = useState(false);

  const playAudio = useCallback(() => {
    if ("speechSynthesis" in window && currentCard) {
      const utterance = new SpeechSynthesisUtterance(currentCard.hanzi);
      utterance.lang = "zh-CN";
      window.speechSynthesis.speak(utterance);
    }
  }, [currentCard]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev < totalCards - 1) {
        setIsFlipped(false);
        return prev + 1;
      }
      setIsFinished(true);
      return prev;
    });
  }, [totalCards]);

  const handleRate = useCallback(
    (type: Rating) => {
      setStats((prev) => ({ ...prev, [type]: prev[type] + 1 }));
      setHistory((prev) => [...prev, { index: currentIndex, rating: type }]);
      handleNext();
    },
    [handleNext, currentIndex]
  );

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setStats((prev) => ({ ...prev, [last.rating]: prev[last.rating] - 1 }));
    setHistory((prev) => prev.slice(0, -1));
    setCurrentIndex(last.index);
    setIsFlipped(false);
    setIsFinished(false);
  }, [history]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished) return;

      if (e.code === "Space") {
        const tag = (e.target as HTMLElement).tagName;
        if (tag === "BUTTON" || tag === "A" || tag === "INPUT") return;
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === "ArrowLeft") {
        handleUndo();
      } else if (e.key.toLowerCase() === "a") {
        playAudio();
      } else if (e.key === "1") {
        handleRate("again");
      } else if (e.key === "2") {
        handleRate("hard");
      } else if (e.key === "3") {
        handleRate("good");
      } else if (e.key === "4") {
        handleRate("easy");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFinished, handleUndo, handleRate, playAudio]);

  const startSession = useCallback((cards: Card[]) => {
    setSessionCards(cards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsFinished(false);
    setStats(EMPTY_STATS);
    setHistory([]);
  }, []);

  const handleRestart = useCallback(() => {
    startSession(SAMPLE_CARDS);
  }, [startSession]);

  // Only review the cards marked "Again"
  const againCards = useMemo(() => {
    const lastRatingByIndex = new Map<number, Rating>();
    history.forEach((h) => lastRatingByIndex.set(h.index, h.rating));
    const indexes = [...lastRatingByIndex.entries()]
      .filter(([, rating]) => rating === "again")
      .map(([index]) => index);
    return indexes.map((i) => sessionCards[i]);
  }, [history, sessionCards]);

  const handleReviewMistakes = useCallback(() => {
    if (againCards.length === 0) return;
    startSession(againCards);
  }, [againCards, startSession]);

  return (
    <div className="w-full min-h-[calc(100vh)] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-start py-8 px-4 select-none transition-colors duration-300">
      <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 no-scrollbar">
        {HSK_LEVELS.map((lvl) => {
          const isActive = selectedHsk === lvl.id;
          return (
            <button
              key={lvl.id}
              type="button"
              disabled={lvl.locked}
              aria-label={lvl.locked ? `${lvl.label} — hoàn thành cấp trước để mở khóa` : lvl.label}
              onClick={() => {
                setSelectedHsk(lvl.id);
                handleRestart();
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                isActive
                  ? "bg-brand-500 text-white shadow-xs"
                  : lvl.locked
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50"
              }`}
            >
              <span>{lvl.label}</span>
              {lvl.locked && <Lock className="w-3 h-3 ml-0.5" />}
            </button>
          );
        })}
      </div>

      {isFinished ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[500px] mt-12 bg-white dark:bg-[#1e293b] rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl text-center space-y-6"
        >
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 text-brand-500 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Session completed!
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              You have completed the session with {totalCards} vocabulary words from HSK {selectedHsk}.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-900/30">
              <span className="text-xs text-red-600 font-semibold block">Again (Need to review)</span>
              <span className="text-xl font-bold text-red-700 dark:text-red-400">{stats.again}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-900/30">
              <span className="text-xs text-amber-600 font-semibold block">Hard (Difficult)</span>
              <span className="text-xl font-bold text-amber-700 dark:text-amber-400">{stats.hard}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-900/30">
              <span className="text-xs text-blue-600 font-semibold block">Good (Remembered well)</span>
              <span className="text-xl font-bold text-blue-700 dark:text-blue-400">{stats.good}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-900/30">
              <span className="text-xs text-emerald-600 font-semibold block">Easy</span>
              <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{stats.easy}</span>
            </div>
          </div>

          {againCards.length > 0 && (
            <button
              type="button"
              onClick={handleReviewMistakes}
              className="w-full py-3.5 bg-[#FF6B6B] hover:bg-[#fa5252] text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Review {againCards.length} Mistake{againCards.length > 1 ? "s" : ""}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleRestart}
            className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Session</span>
          </button>
        </motion.div>
      ) : (
        <div className="w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-start py-6 px-4 select-none transition-colors duration-300">
          <div className="relative w-full flex items-center justify-center">
            <button
              type="button"
              onClick={handleUndo}
              disabled={history.length === 0}
              aria-label="Undo last rating"
              className="lg:hidden absolute -left-2 z-20 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 disabled:opacity-30 active:scale-95 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="w-full max-w-[800px] h-[460px] [perspective:1200px] flex flex-col items-center mt-4">
              <motion.div
                onClick={() => setIsFlipped(!isFlipped)}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                className="w-full h-full bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-xl cursor-pointer flex flex-col justify-between items-center text-center relative [transform-style:preserve-3d]"
              >
                <div className="w-full h-full flex flex-col justify-between items-center [backface-visibility:hidden]">
                  <div className="px-4 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-brand-500 dark:text-emerald-400 rounded-full text-xs font-semibold">
                    {currentCard.type}
                  </div>
                  <div className="my-auto py-4">
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-6xl font-serif font-bold text-gray-900 dark:text-white tracking-wide">
                        {currentCard.hanzi}
                      </span>
                      <button
                        type="button"
                        aria-label="Play pronunciation"
                        onClick={(e) => {
                          e.stopPropagation();
                          playAudio();
                        }}
                        className="w-9 h-9 rounded-full bg-brand-500 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-sm"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-brand-500 font-medium text-lg mt-2">{currentCard.pinyin}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowHandWriting(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <PenTool className="w-3.5 h-3.5 text-gray-400" />
                    <span>Handwriting Practice</span>
                  </button>
                </div>

                <div className="absolute inset-0 w-full h-full p-6 flex flex-col justify-between items-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <span className="text-xs font-bold text-gray-400">Meaning & Example</span>
                  <div className="space-y-3 my-auto w-full px-2 sm:px-4 flex flex-col items-center">
                    <span className="text-6xl font-serif font-bold text-gray-900 dark:text-white tracking-wide mt-3">
                      {currentCard.hanzi}
                    </span>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white text-center pt-5">
                      {currentCard.meaning}
                    </p>
                    <div className="w-full h-[150px] whitespace-pre-line p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-brand-500 dark:border-gray-700 text-lg text-gray-600 dark:text-gray-300 text-left overflow-y-auto">
                      {currentCard.example}
                    </div>
                  </div>
                </div>
              </motion.div>
              <AnimatePresence>
                {showHandWriting && (
                  <HandwritingModal
                    hanzi={currentCard.hanzi}
                    type={currentCard.type}
                    onClose={() => setShowHandWriting(false)}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="w-full max-w-[460px] mt-6 space-y-2">
            <div className="w-full bg-gray-200 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-brand-500 h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
              />
            </div>
            <p className="text-left text-xs font-bold text-gray-700 dark:text-gray-300">
              {currentIndex + 1}/{totalCards} Words
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-[460px] mt-4">
            <button
              type="button"
              onClick={() => handleRate("again")}
              className="py-3 px-2 rounded-xl bg-[#FF6B6B] hover:bg-[#fa5252] text-white font-medium text-sm transition-all active:scale-95 shadow-xs flex items-center justify-center gap-1"
            >
              <span>Again</span>
              <span className="hidden lg:inline text-xs opacity-75">(1)</span>
            </button>
            <button
              type="button"
              onClick={() => handleRate("hard")}
              className="py-3 px-2 rounded-xl bg-[#FAB005] hover:bg-[#f59f00] text-white font-medium text-sm transition-all active:scale-95 shadow-xs flex items-center justify-center gap-1"
            >
              <span>Hard</span>
              <span className="hidden lg:inline text-xs opacity-75">(2)</span>
            </button>
            <button
              type="button"
              onClick={() => handleRate("good")}
              className="py-3 px-2 rounded-xl bg-[#4DABF7] hover:bg-[#339af0] text-white font-medium text-sm transition-all active:scale-95 shadow-xs flex items-center justify-center gap-1"
            >
              <span>Good</span>
              <span className="hidden lg:inline text-xs opacity-75">(3)</span>
            </button>
            <button
              type="button"
              onClick={() => handleRate("easy")}
              className="py-3 px-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm transition-all active:scale-95 shadow-xs flex items-center justify-center gap-1"
            >
              <span>Easy</span>
              <span className="hidden lg:inline text-xs opacity-75">(4)</span>
            </button>
          </div>

          <div className="mt-6 text-xs text-gray-400 dark:text-gray-500 text-center">
            <p className="hidden lg:block">
              Shortcut:{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">←</kbd>{" "}
              Undo{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">Space</kbd>{" "}
              Flip{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">A</kbd>{" "}
              Pronounce{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">1-4</kbd>{" "}
              Rate
            </p>
          </div>
        </div>
      )}
    </div>
  );
}