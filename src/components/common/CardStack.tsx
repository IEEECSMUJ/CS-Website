"use client";
import { useEffect, useRef, useState } from "react";
import styles from "@/components/common/CardStack.module.css";
import { motion } from "framer-motion";
import BoxReveal from "./BoxReveal";

const images = [
  "/images/events/1.avif",
  "/images/events/2.avif",
  "/images/events/3.avif",
  "/images/events/4.avif",
  "/images/events/5.avif",
  "/images/events/6.avif",
  "/images/events/7.avif",
];

export default function CardStack() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => {
            setOpen(true);
          }, 500);

          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div id="card-stack-section">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10% 0px" }}
        className="w-full flex justify-center"
        style={{
          paddingTop: "3rem",
          marginBottom: "2rem",
        }}
      >
        <BoxReveal align="justify-center" boxColor="#f9ba1f">
          <h2 style={{
            display: "inline-block",
            textAlign: "center",
            fontWeight: "bold",
            color: "white",
            fontSize: "clamp(1.8rem, 5vmin, 3rem)",
            letterSpacing: "3px",
            textTransform: "uppercase",
            margin: 0,
            padding: 0,
          }}>
            Our Events
          </h2>
        </BoxReveal>
      </motion.div>
      <section ref={containerRef} className={styles.container} style={{ minHeight: "100vh", paddingBottom: "10rem", paddingTop: "4rem" }}>
        <div className={`${styles.cards} ${open ? styles.open : ""}`}>
          {images.map((src, index) => (
            <div key={index} className={styles.card}>
              <img
                src={src}
                alt={`card-${index}`}
                draggable="false"
                loading="eager"
                decoding="async"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}