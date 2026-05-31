import React from 'react';
import { motion } from 'framer-motion';
import BoxReveal from './BoxReveal';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18, // slightly faster stagger (approx 14% of duration)
      delayChildren: 0.08,
    },
  },
};

function Word({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <span
      className={`whitespace-nowrap ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}

export default function ImpactText() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@700;800;900&display=swap');
      `}</style>

      <section className="w-full py-6 sm:py-8 lg:py-10 flex justify-center items-center px-4 md:px-8 bg-transparent relative z-10 selection:bg-[#F4A119] selection:text-black">
        <div className="max-w-[85rem] mx-auto text-center flex flex-col items-center justify-center text-[#e4e4e1]">

          <motion.h2
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-25% 0px" }}
            className="text-[1.7rem] sm:text-[3rem] md:text-[4.2rem] lg:text-[5.5rem] xl:text-[6.5rem] leading-[1.0] sm:leading-[0.95] lg:leading-[0.9] tracking-tight uppercase font-black flex flex-col items-center w-full"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >

            {/* Line 1 */}
            <BoxReveal duration={2.5}>
              <div className="flex flex-wrap justify-center items-center gap-x-2 sm:gap-x-4 lg:gap-x-6 w-full">
                <Word className="text-[#F4A119] font-normal tracking-normal lowercase" style={{ fontFamily: "'Playfair Display', serif", fontVariant: 'small-caps' }}>
                  <span className="uppercase">REDEFINING</span>
                </Word>
                <Word>LIMITS,</Word>
              </div>
            </BoxReveal>

            {/* Line 2 */}
            <BoxReveal duration={2.5}>
              <div className="flex flex-wrap justify-center items-center gap-x-2 sm:gap-x-4 lg:gap-x-6 w-full">
                <Word>FIGHTING</Word>
                <Word>FOR</Word>
                <Word className="text-[#F4A119] font-normal tracking-normal lowercase" style={{ fontFamily: "'Playfair Display', serif", fontVariant: 'small-caps' }}>
                  <span className="uppercase">WINS,</span>
                </Word>
              </div>
            </BoxReveal>

            {/* Line 3 */}
            <BoxReveal duration={2.5}>
              <div className="flex flex-wrap justify-center items-center gap-x-2 sm:gap-x-4 lg:gap-x-6 w-full">
                <Word>BRINGING</Word>
                <Word>IT</Word>
                <Word>ALL</Word>
                <Word>IN</Word>
              </div>
            </BoxReveal>

            {/* Line 4 */}
            <BoxReveal duration={2.5}>
              <div className="flex flex-wrap justify-center items-center gap-x-2 sm:gap-x-4 lg:gap-x-6 w-full">
                <Word>ALL</Word>
                <Word>WAYS.</Word>
                <Word>DEFINING</Word>
                <Word>A</Word>
              </div>
            </BoxReveal>

            {/* Line 5 */}
            <BoxReveal duration={2.5}>
              <div className="flex flex-wrap justify-center items-center gap-x-2 sm:gap-x-4 lg:gap-x-6 w-full">
                <Word className="text-[#F4A119] font-normal tracking-normal lowercase" style={{ fontFamily: "'Playfair Display', serif", fontVariant: 'small-caps' }}>
                  <span className="uppercase">LEGACY</span>
                </Word>
                <Word>IN</Word>
                <Word>FORMULA</Word>
                <Word>1</Word>
              </div>
            </BoxReveal>

            {/* Line 6 */}
            <BoxReveal duration={2.5}>
              <div className="flex flex-wrap justify-center items-center gap-x-2 sm:gap-x-4 lg:gap-x-6 w-full">
                <Word>ON</Word>
                <Word>AND</Word>
                <Word>OFF</Word>
                <Word>THE</Word>
              </div>
            </BoxReveal>

            {/* Line 7 */}
            <BoxReveal duration={2.5}>
              <div className="flex flex-wrap justify-center items-center gap-x-2 sm:gap-x-4 lg:gap-x-6 w-full">
                <Word>TRACK.</Word>
              </div>
            </BoxReveal>

          </motion.h2>
        </div>
      </section>
    </>
  );
}