"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  PlayCircle,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-25">

      {/* Background Image */}
      <Image
        src="/images/banner.jpeg"
        alt="Digital Quran Speaker"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent" />

      {/* Decorative Blur */}
      <div className="absolute left-0 top-0 w-[500px] h-full bg-white/20 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 lg:px-10 min-h-screen flex items-center">

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: .8 }}
          className="max-w-xl"
        >

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .2 }}
            className="inline-flex items-center rounded-full bg-blue-600 text-white px-5 py-1 text-sm font-semibold shadow-lg"
          >
            ✨ আল্লাহর বাণী সবসময় সাথে রাখুন
          </motion.div>

          {/* Heading */}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .3 }}
            className="mt-7 text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-[#083B66]"
          >
            ডিজিটাল
            <br />
            কোরআন স্পিকার
          </motion.h1>

          {/* Description */}

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .4 }}
            className="text-lg leading-8 text-slate-700"
          >
            ৩০ পারা কোরআন, ৫০+ হাদিস,
            রুকইয়া শরীফ, নামাজ শিক্ষা,
            শিশু শিক্ষা এবং আরও অনেক কিছু
            একটি স্মার্ট ডিভাইসে।
          </motion.p>

          {/* Buttons */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .5 }}
            className="mt-10 flex flex-wrap gap-4"
          >

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 shadow-xl transition">
              অর্ডার করুন
              <ArrowRight size={20} />
            </button>

            <button className="bg-white/70 backdrop-blur-md border border-black px-8 py-4 rounded-xl font-semibold flex items-center gap-2 hover:bg-white transition">
              <PlayCircle size={20} />
              ভিডিও দেখুন
            </button>

          </motion.div>

          {/* Features */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="rounded-2xl bg-white/70 backdrop-blur-md border border-white shadow-lg p-4">
              <p className="text-4xl item-center justify-center pb-2">📖</p>
              <h4 className="font-bold text-[#0D3B66] text-sm">
                ৩০ পারা কোরআন
              </h4>

            </div>

            <div className="rounded-2xl bg-white/70 backdrop-blur-md border border-white shadow-lg p-4">
              <p className="text-4xl item-center justify-center pb-2">📚</p>
              <h4 className="font-bold text-[#0D3B66]">
                ৫০+ হাদিস
              </h4>

            </div>

            <div className="rounded-2xl bg-white/70 backdrop-blur-md border border-white shadow-lg p-4">
              <p className="text-4xl item-center justify-center pb-2"> 🤲</p>
              <h4 className="font-bold text-[#0D3B66]">
                রুকইয়া শরীফ
              </h4>

            </div>

            <div className="rounded-2xl bg-white/70 backdrop-blur-md border border-white shadow-lg p-4">
              <p className="text-4xl item-center justify-center pb-2">🕌</p>
              <h4 className="font-bold text-[#0D3B66]">
                নামাজ শিক্ষা
              </h4>

            </div>
          </motion.div>

          {/* Trust */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: .7 }}
            className="mt-10 flex flex-wrap gap-6"
          >

            <div className="flex items-center gap-2">
              <ShieldCheck
                className="text-green-600"
                size={22}
              />
              <span className="font-bold">
                ১০০% Original
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Truck
                className="text-blue-600"
                size={22}
              />
              <span className="font-medium">
                Cash On Delivery
              </span>
            </div>

            <div className="flex items-center gap-2">
              <RotateCcw
                className="text-orange-500"
                size={22}
              />
              <span className="font-medium">
                ফ্রি হোম ডেলিভারি
              </span>
            </div>

          </motion.div>

          {/* Stats */}



        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16"
        >
          <a
            href="#our-products"
            className="inline-flex items-center gap-2 text-slate-700 hover:text-blue-600 transition"
          >
            <span className="text-sm font-medium">
              নিচে স্ক্রল করুন
            </span>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.6,
              }}
            >
              ↓
            </motion.div>
          </a>
        </motion.div>

      </div>



      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white to-transparent" />

    </section >
  );
}
