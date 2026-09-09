"use client";

import { useState, useEffect, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Volume2,
  Lock,
  ChevronLeft,
  ChevronRight,
  PenTool,
  RotateCcw,
  Sparkles,
} from "lucide-react";

const SAMPLE_CARDS = [
  {
    id: 1,
    hanzi: "爱好",
    pinyin: "ài hào",
    meaning: "Hobby / Interest",
    type: "HSK 1 · Noun/Verb",
    example: "我有许多爱好 (I have many hobbies)",
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

export default function FlashcardsPage() {
  const [selectedHsk, setSelectedHsk] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Thống kê kết quả cho màn hình tổng kết
  const [stats, setStats] = useState({
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
  });

  const currentCard = SAMPLE_CARDS[currentIndex];
  const totalCards = SAMPLE_CARDS.length;

  // Framer motion drag setup
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 150], [-12, 12]);
  const cardOpacity = useTransform(x, [-120, 0, 120], [0.6, 1, 0.6]);

  // Hàm phát âm
  const playAudio = useCallback(() => {
    if ("speechSynthesis" in window && currentCard) {
      const utterance = new SpeechSynthesisUtterance(currentCard.hanzi);
      utterance.lang = "zh-CN";
      window.speechSynthesis.speak(utterance);
    }
  }, [currentCard]);

  // Chuyển thẻ tiếp theo
  const handleNext = useCallback(() => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else {
      setIsFinished(true);
    }
  }, [currentIndex, totalCards]);

  // Lùi thẻ trước
  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  // Đánh giá SRS
  const handleRate = useCallback(
    (type: "again" | "hard" | "good" | "easy") => {
      setStats((prev) => ({ ...prev, [type]: prev[type] + 1 }));
      handleNext();
    },
    [handleNext]
  );

  // Lắng nghe phím tắt trên Desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished) return;

      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
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
  }, [isFinished, handleNext, handlePrev, handleRate, playAudio]);

  // Reset học lại từ đầu
  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsFinished(false);
    setStats({ again: 0, hard: 0, good: 0, easy: 0 });
  };

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] bg-white dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 flex flex-col items-center justify-start py-8 px-4 select-none transition-colors duration-300">
      
      {/* 1. THANH LỌC CẤP ĐỘ HSK */}
      <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 no-scrollbar">
        {HSK_LEVELS.map((lvl) => {
          const isActive = selectedHsk === lvl.id;
          return (
            <button
              key={lvl.id}
              type="button"
              disabled={lvl.locked}
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

      {/* 2. MÀN HÌNH TỔNG KẾT (SESSION SUMMARY KHI HỌC XONG) */}
      {isFinished ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[500px] mt-12 bg-white dark:bg-[#1e293b] rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl text-center space-y-6"
        >
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 text-brand-primary rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Phiên học hoàn tất!
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Bạn đã ôn luyện xong {totalCards} từ vựng thuộc HSK {selectedHsk}.
            </p>
          </div>

          {/* Bảng phân loại kết quả */}
          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-900/30">
              <span className="text-xs text-red-600 font-semibold block">Again (Cần ôn lại)</span>
              <span className="text-xl font-bold text-red-700 dark:text-red-400">{stats.again}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-900/30">
              <span className="text-xs text-amber-600 font-semibold block">Hard (Khá khó)</span>
              <span className="text-xl font-bold text-amber-700 dark:text-amber-400">{stats.hard}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-900/30">
              <span className="text-xs text-blue-600 font-semibold block">Good (Tốt)</span>
              <span className="text-xl font-bold text-blue-700 dark:text-blue-400">{stats.good}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-900/30">
              <span className="text-xs text-emerald-600 font-semibold block">Easy (Rất dễ)</span>
              <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{stats.easy}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRestart}
            className="w-full py-3.5 bg-brand-primary hover:bg-brand-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Ôn luyện tiếp</span>
          </button>
        </motion.div>
      ) : (
        /* 3. KHU VỰC THẺ FLASHCARD CHÍNH */
        <div className="w-full max-w-xl flex flex-col items-center mt-6">
          
          <div className="relative w-full flex items-center justify-center">
            {/* Nút mũi tên lùi (Chỉ hiện trên Mobile/Tablet) */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              aria-label="Previous card"
              className="lg:hidden absolute -left-2 z-20 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 disabled:opacity-30 active:scale-95 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Khối Flip Card với phối cảnh 3D */}
            <div className="w-full max-w-[460px] min-h-[340px] [perspective:1000px]">
              <motion.div
                style={{ x, rotate, opacity: cardOpacity }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 100) handlePrev();
                  else if (info.offset.x < -100) handleNext();
                }}
                onClick={() => setIsFlipped(!isFlipped)}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full h-full min-h-[340px] bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-xl cursor-pointer flex flex-col justify-between items-center text-center relative [transform-style:preserve-3d]"
              >
                {/* --- MẶT TRƯỚC (FRONT) --- */}
                <div className="w-full h-full flex flex-col justify-between items-center [backface-visibility:hidden]">
                  {/* Tag phân loại */}
                  <div className="px-4 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-brand-primary dark:text-emerald-400 rounded-full text-xs font-semibold">
                    {currentCard.type}
                  </div>

                  {/* Chữ Hán & Nút Loa tròn màu xanh */}
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
                        className="w-9 h-9 rounded-full bg-brand-primary text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-sm"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-brand-primary font-medium text-lg mt-2">
                      {currentCard.pinyin}
                    </p>
                  </div>

                  {/* Nút Luyện viết */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Gọi canvas tập viết
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <PenTool className="w-3.5 h-3.5 text-gray-400" />
                    <span>Handwriting Practice</span>
                  </button>
                </div>

                {/* --- MẶT SAU (BACK - HIỆN NGHĨA & VÍ DỤ) --- */}
                <div className="absolute inset-0 w-full h-full p-6 flex flex-col justify-between items-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <span className="text-xs font-bold text-gray-400">
                    Ý NGHĨA & VÍ DỤ
                  </span>

                  <div className="space-y-3 my-auto text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {currentCard.meaning}
                    </p>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300">
                      {currentCard.example}
                    </div>
                  </div>

                  <span className="text-[11px] text-gray-400">
                    ↻ Nhấn để xem lại chữ Hán
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Nút mũi tên tiến (Chỉ hiện trên Mobile/Tablet) */}
            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex === totalCards - 1}
              aria-label="Next card"
              className="lg:hidden absolute -right-2 z-20 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 disabled:opacity-30 active:scale-95 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* 4. THANH TIẾN ĐỘ */}
          <div className="w-full max-w-[460px] mt-6 space-y-2">
            <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-brand-primary h-full transition-all duration-300"
                style={{
                  width: `${((currentIndex + 1) / totalCards) * 100}%`,
                }}
              />
            </div>
            <p className="text-left text-xs font-bold text-gray-700 dark:text-gray-300">
              {currentIndex + 1}/{totalCards} Words
            </p>
          </div>

          {/* 5. CỤM 4 NÚT ĐÁNH GIÁ SRS */}
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

          {/* 6. HƯỚNG DẪN ĐIỀU KHIỂN */}
          <div className="mt-6 text-xs text-gray-400 dark:text-gray-500 text-center">
            <p className="hidden lg:block">
              Phím tắt: <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">→</kbd> Chuyển thẻ &bull; <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">Space</kbd> Lật thẻ &bull; <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">A</kbd> Phát âm &bull; <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">1-4</kbd> Đánh giá
            </p>
            <p className="lg:hidden">
              Chạm để lật &bull; Vuốt sang bên hoặc bấm mũi tên để chuyển từ
            </p>
          </div>

        </div>
      )}

    </div>
  );
}