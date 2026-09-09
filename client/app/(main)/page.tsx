"use client";

import Image from "next/image";
import { ArrowRight, Volume2, Flame, Target, Trophy, Lock, Check } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function HomePage() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-full min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-x-hidden transition-colors duration-300">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          <div className="lg:col-span-6 space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight leading-[1.15] text-gray-900 dark:text-white">
              Master Chinese Hanzi{" "}
              <span className="text-brand-500">Effortlessly</span> with Smart SRS & AI Tutor
            </h1>

            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg leading-relaxed max-w-xl">
              Conquer Chinese characters from HSK 1 to HSK 6. Personalized daily goals (10 mins/day),
              adaptive Spaced Repetition (SRS), and real-time AI grammar feedback.
            </p>

            <div>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-full text-base shadow-lg shadow-brand-500/20 transition-all hover:translate-y-[-1px] active:translate-y-[1px]"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-xs">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>14-Day Streak</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-xs">
                <Target className="w-4 h-4 text-emerald-500" />
                <span>Daily Goal: 15/20 Words</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-xs">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>HSK Level 2: 68%</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="flex flex-wrap gap-2 mb-4 justify-center">
              {["Multiple Choice", "Fill-in-the-Blanks", "Sentence Order", "Dictation"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Flashcard Container */}
            <div className="w-full max-w-[420px] h-[340px] [perspective:1200px]">
              <motion.div
                className="relative w-full h-full [transform-style:preserve-3d] cursor-pointer"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div className="absolute inset-0 [backface-visibility:hidden] bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-2xl flex flex-col">
                  <div className="flex justify-between items-center text-xs text-gray-400 dark:text-gray-500 font-medium mb-6">
                    <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-brand-500 dark:text-emerald-400 rounded-md font-semibold">
                      HSK 1 · Noun/Verb
                    </span>
                    <span>↻ Tap to flip</span>
                  </div>
 
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-7xl font-bold font-serif text-gray-900 dark:text-white tracking-wide">
                        爱好
                      </span>
                      <button
                        type="button"
                        aria-label="Phát âm"
                        onClick={(e) => e.stopPropagation()}
                        className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 transition-colors shadow-xs"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-brand-500 dark:text-emerald-400 font-medium text-lg mt-2">ài hào</p>
                  </div>
                </div>
 
                <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-2xl flex flex-col">
                  <div className="flex justify-between items-center text-xs text-gray-400 dark:text-gray-500 font-medium mb-6">
                    <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-brand-500 dark:text-emerald-400 rounded-md font-semibold">
                      HSK 1 · Noun/Verb
                    </span>
                    <span>↻ Tap to flip</span>
                  </div>
 
                  <div className="flex-1 flex flex-col justify-start p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 text-left space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-gray-200">
                      <span className="text-brand-500">Explanation</span>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-white text-justify">
                      爱 means love, 好 means fond of. Together they form &quot;Hobby&quot;.
                    </p>
                    <div className="pt-1 text-sm text-gray-600 dark:text-white bg-white dark:bg-gray-900 px-3 py-2 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                      Example: 我有许多爱好 — I have many hobbies.
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="mt-16 max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-lg">
          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-6 font-medium">
            <span className="font-bold text-gray-900 dark:text-white">Your HSK Roadmap</span>
            <span>Unlock levels as you master words</span>
          </div>

          <div className="relative flex items-center justify-between">
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-gray-100 dark:bg-gray-800 z-0">
              <div className="h-full bg-brand-500 w-1/2" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-md">
                <Check className="w-4 h-4" />
              </div>
                <span className="absolute top-full mt-2 text-[11px] font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                HSK 1
              </span>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-900 border-2 border-brand-500 text-brand-500 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shadow-md">
                2
              </div>
              <span className="absolute top-full text-[11px] font-bold text-brand-500 dark:text-emerald-400 mt-2">HSK 2</span>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 flex items-center justify-center">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <span className="absolute top-full text-[11px] font-semibold text-gray-400 dark:text-gray-500 mt-2">HSK 3</span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative w-full h-64 sm:h-80 bg-stone-900 flex items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="/images/banner_quote.png"
            alt="Chinese Calligraphy Street Background"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative z-10 space-y-4 max-w-3xl">
          <p className="text-3xl sm:text-5xl md:text-7xl font-bold font-[family-name:var(--font-hanzi-quote)] text-white tracking-widest">
            千里之行，始于足下
          </p>
          <p className="text-2xl sm:text-2xl text-gray-300 italic font-light tracking-wide">
            &quot;A journey of a thousand miles begins with a single step&quot; (Lao Tzu)
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
              Increase your<br />vocabulary
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">
              Traditional and new effective approaches to word study
            </p>
            <div>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-full text-sm shadow-md transition-all"
              >
                <span>Textbook</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative w-full h-[320px] sm:h-[400px] flex items-center justify-center">
            <Image
              src="/images/vocab_illustration.png"
              alt="Increase Vocabulary Illustration"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>
    </div>
  );
}