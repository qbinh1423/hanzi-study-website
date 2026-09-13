"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { X, RotateCcw, Pencil, CheckCircle2 } from "lucide-react";

type HandwritingModalProps = {
  hanzi: string;
  type: string;
  onClose: () => void;
};

const CANVAS_SIZE = 280;

type HanziWriterInstance = {
  animateCharacter: (options?: { onComplete?: () => void }) => void;
  showCharacter: () => void;
  hideCharacter: () => void;
  cancelQuiz: () => void;
  quiz: (options: {
    onCorrectStroke?: (data: { strokesRemaining: number; totalMistakes: number }) => void;
    onComplete?: (summary: { totalMistakes: number }) => void;
  }) => void;
};

export default function HandwritingModal({ hanzi, type, onClose }: HandwritingModalProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriterInstance | null>(null);

  // Tách cụm từ thành danh sách ký tự đơn lẻ
  const characters = Array.from(hanzi);
  const [selectedCharIndex, setSelectedCharIndex] = useState(0);
  const currentChar = characters[selectedCharIndex] || characters[0];

  const [mode, setMode] = useState<"demo" | "quiz">("demo");
  const [strokeProgress, setStrokeProgress] = useState({ done: 0, total: 0 });
  const [quizResult, setQuizResult] = useState<null | { mistakes: number }>(null);
  const [loadedChar, setLoadedChar] = useState<string | null>(null);
  const isLoaded = loadedChar === currentChar;

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
          width: CANVAS_SIZE,
          height: CANVAS_SIZE,
          padding: 16,
          showOutline: true,
          strokeAnimationSpeed: 1,
          delayBetweenStrokes: 200,
          strokeColor: "#111827",
          outlineColor: "#E5E7EB",
          drawingWidth: 24,
          highlightColor: "#199E6E",
          onLoadCharDataSuccess: () => {
            if (!cancelled) {
              setLoadedChar(currentChar);
            }
          },
          onLoadCharDataError: (err) => {
            console.error("Lỗi tải nét chữ:", err);
          },
        });

        writerRef.current = writer;
        writer.animateCharacter();
      } catch (err) {
        console.error("Lỗi khởi tạo HanziWriter:", err);
      }
    });

    return () => {
      cancelled = true;
      if (writerRef.current) {
        writerRef.current.cancelQuiz();
      }
      writerRef.current = null;
    };
  }, [currentChar]);

  const handleSelectChar = useCallback((index: number) => {
    setSelectedCharIndex(index);
    setQuizResult(null);
    setStrokeProgress({ done: 0, total: 0 });
    setMode("demo");
  }, []);

  const handleShowDemo = useCallback(() => {
    if (!writerRef.current || !isLoaded) return;
    setMode("demo");
    setQuizResult(null);
    writerRef.current.cancelQuiz();
    writerRef.current.showCharacter();
    writerRef.current.animateCharacter();
  }, [isLoaded]);

  const handleStartQuiz = useCallback(() => {
    if (!writerRef.current || !isLoaded) return;
    setMode("quiz");
    setQuizResult(null);
    setStrokeProgress({ done: 0, total: 0 });

    writerRef.current.quiz({
      onCorrectStroke: (data: { strokesRemaining: number; totalMistakes: number }) => {
        setStrokeProgress((prev) => ({
          done: prev.total - data.strokesRemaining + 1,
          total: prev.total || prev.done + data.strokesRemaining,
        }));
      },
      onComplete: (summary: { totalMistakes: number }) => {
        setQuizResult({ mistakes: summary.totalMistakes });
      },
    });
  }, [isLoaded]);

  return (
    <div 
    onClick={(e) => e.stopPropagation()}
    className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-sm bg-white dark:bg-[#1e293b] rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-gray-800"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-brand-500 dark:text-emerald-400 rounded-md text-xs font-semibold">
            {type}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng luyện viết"
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Thanh chọn ký tự nếu từ có từ 2 chữ Hán trở lên */}
        {characters.length > 1 && (
          <div className="flex items-center justify-center gap-2 mb-3 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            {characters.map((char, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectChar(index)}
                className={`px-4 py-1 rounded-lg font-serif font-bold text-base transition-all ${
                  selectedCharIndex === index
                    ? "bg-brand-500 text-white shadow-xs"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {char}
              </button>
            ))}
          </div>
        )}

        {/* Khung lưới tập viết (Canvas) */}
        <div
          className="relative mx-auto rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-white"
          style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, transparent calc(50% - 0.5px), #d1d5db calc(50% - 0.5px), #d1d5db calc(50% + 0.5px), transparent calc(50% + 0.5px)),
                linear-gradient(to bottom, transparent calc(50% - 0.5px), #d1d5db calc(50% - 0.5px), #d1d5db calc(50% + 0.5px), transparent calc(50% + 0.5px)),
                repeating-linear-gradient(45deg, transparent, transparent 6px, #e5e7eb 6px, #e5e7eb 7px),
                repeating-linear-gradient(-45deg, transparent, transparent 6px, #e5e7eb 6px, #e5e7eb 7px)
              `,
            }}
          />
          <div ref={targetRef} className="relative z-10" />
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
              Đang tải nét chữ...
            </div>
          )}
        </div>

        <div className="mt-3 text-center h-6">
          {mode === "quiz" && !quizResult && strokeProgress.total > 0 && (
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Nét {Math.min(strokeProgress.done, strokeProgress.total)}/{strokeProgress.total}
            </p>
          )}
          {quizResult && (
            <p className="text-xs font-semibold text-brand-500 dark:text-emerald-400 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Hoàn thành · {quizResult.mistakes === 0 ? "Không sai nét nào!" : `${quizResult.mistakes} lần sai`}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            type="button"
            disabled={!isLoaded}
            onClick={handleShowDemo}
            className={`py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 disabled:opacity-50 transition-colors ${
              mode === "demo"
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            Xem lại
          </button>
          <button
            type="button"
            disabled={!isLoaded}
            onClick={handleStartQuiz}
            className={`py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 disabled:opacity-50 transition-colors ${
              mode === "quiz"
                ? "bg-brand-500 text-white"
                : "bg-emerald-50 dark:bg-emerald-500/10 text-brand-500 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20"
            }`}
          >
            <Pencil className="w-4 h-4" />
            Luyện viết
          </button>
        </div>
      </motion.div>
    </div>
  );
}