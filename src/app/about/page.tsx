"use client";

import dynamic from "next/dynamic";
import FadishBlackBackground from "@/components/FadishBlackBackground";
import SmoothScrollProvider from "@/components/common/SmoothScrollProvider";
import TopographicBackground from "@/components/LineBackground";
import { Calendar, Users, Award, Flame, BrainCircuit, Share2 } from "lucide-react";
import styles from "./about.module.css";

const LogoScrollWrapper = dynamic(
  () => import("@/components/common/LogoScrollWrapper"),
  { ssr: false }
);

const ChairpersonSection = dynamic(
  () => import("@/components/about/ChairpersonSection"),
  { ssr: false }
);

export default function AboutPage() {
  return (
    <SmoothScrollProvider>
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <FadishBlackBackground />
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
          <TopographicBackground
            lineColor="rgba(249, 186, 31, 0.22)"
            backgroundColor="transparent"
            lineCount={10}
            animated={true}
          />
        </div>
      </div>

      <div id="about-page-wrapper" className="relative w-full z-[1]">
        <div id="about-scroll-canvas" className={styles.scrollCanvas}>
          <div className={styles.stickyHero}>
            <div
              id="about-hero-title"
              className="flex flex-col items-center md:items-start"
            >
              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 900,
                  background: "linear-gradient(to right, #ffffff, #f9ba1f)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: 1.15,
                  paddingBottom: "0.15em",
                  letterSpacing: "-0.03em",
                  margin: 0,
                }}
                className={styles.heroTitle}
              >
                About Us
              </h1>
              <div
                style={{
                  width: "40px",
                  height: "3px",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 0 8px rgba(255, 255, 255, 0.8), 0 0 15px rgba(255, 255, 255, 0.5)",
                  borderRadius: "999px",
                  marginTop: "10px",
                }}
              />
              <p className={styles.heroSubtitle}>
                Empowering computing at its best with <span className={styles.heroSubtitleHighlight}>inclusion</span> and <span className={styles.heroSubtitleHighlight}>diversity</span>.
              </p>
            </div>

            {/* Scroll Down Indicator */}
            <div className={styles.scrollIndicator}>
              <span className={styles.scrollText}>Scroll to discover</span>
              <div className={styles.mouseIcon}>
                <div className={styles.mouseWheel}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section
        id="about-content-section"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          minHeight: "100vh",
        }}
        className={`relative ${styles.contentSection}`}
      >
        <div className={styles.navContainer}>
          <div className={styles.aboutGrid}>
            
            {/* Left Column: Stats Dashboard */}
            <div className={styles.statsColumn}>
              <div className={styles.statCard}>
                <Calendar className={styles.statIcon} size={28} />
                <span className={styles.statNumber}>2020</span>
                <span className={styles.statLabel}>Established</span>
              </div>
              <div className={styles.statCard}>
                <Users className={styles.statIcon} size={28} />
                <span className={styles.statNumber}>150+</span>
                <span className={styles.statLabel}>Members</span>
              </div>
              <div className={styles.statCard}>
                <Award className={styles.statIcon} size={28} />
                <span className={styles.statNumber}>50+</span>
                <span className={styles.statLabel}>Events</span>
              </div>
              <div className={styles.statCard}>
                <Flame className={styles.statIcon} size={28} />
                <span className={styles.statNumber}>6+</span>
                <span className={styles.statLabel}>Tracks</span>
              </div>
            </div>

            {/* Right Column: Narrative content */}
            <div className="text-white px-6 sm:px-0">
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 900,
                  background: "linear-gradient(to right, #ffffff, #f9ba1f)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: 1.15,
                  paddingBottom: "0.15em",
                  letterSpacing: "-0.03em",
                }}
                className={`uppercase mb-8 ${styles.whoWeAreTitle}`}
              >
                IEEE Computer Society
              </h2>

              <p className={`leading-relaxed mb-6 text-white/75 ${styles.bodyText}`}>
                “Serving computing at its best with inclusion and diversity” is the prime motto of the IEEE Computer Society. This society was created keeping in mind IEEE’s continued commitment to providing options at best. The IEEE Computer Society is driven by the central goals of equity, diversity, inclusion, and yearn to serve computing at its perfection.
              </p>

              <p className={`leading-relaxed mb-6 text-white/75 ${styles.bodyText}`}>
                With an intent to expand the IEEE’s reach and learnings, this society was started a year back in early 2020. Since then, society has tried every possible course of action by conducting diverse events such as webinars, competitions, workshops, and mentorship programs to set a goal for the young achievers. The members of IEEE CS have been skilled and earned minimal expertise in roughly all possible sub-sections of CS via our accelerator program. The senior student mentors steer them on each stage they take and deliver them with the professional material for further reference.
              </p>

              <p className={`leading-relaxed text-white/75 ${styles.bodyText}`}>
                We aim to proactively support diversity and inclusion by being the premier source for information, inspiration, and collaboration in computer science and engineering. Connecting members on campus, this IEEE Computer Society empowers the students who wish to advance in technology by delivering tools at all stages of their professional careers.
                “Computer science is the operating system for all innovations.” At IEEE CS, we look at it similarly, trying to make a better world by working as a team.
              </p>
            </div>

          </div>
        </div>
      </section>

      <section
        id="about-pillars-section"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          minHeight: "100vh",
        }}
        className={`relative ${styles.pillarsSection}`}
      >
        <div className={styles.pillarsContainer}>
          <div className={styles.pillarsHeader}>
            <h3 className={styles.pillarsTitle}>Our Core Pillars</h3>
            <p className={styles.pillarsSubtitle}>
              Fostering a community of computer scientists and software engineers dedicated to excellence.
            </p>
          </div>

          <div className={styles.pillarsGrid}>
            <div className={styles.pillarCard}>
              <BrainCircuit className={styles.pillarIcon} size={38} />
              <h4 className={styles.pillarHeading}>Technical Mastery</h4>
              <p className={styles.pillarDesc}>
                Deep-dives into modern technology stacks, software engineering, and systems architecture.
              </p>
            </div>
            <div className={styles.pillarCard}>
              <Users className={styles.pillarIcon} size={38} />
              <h4 className={styles.pillarHeading}>Inclusion & Diversity</h4>
              <p className={styles.pillarDesc}>
                Fostering an equitable, supportive community that welcomes students from all backgrounds.
              </p>
            </div>
            <div className={styles.pillarCard}>
              <Share2 className={styles.pillarIcon} size={38} />
              <h4 className={styles.pillarHeading}>Creative Collaboration</h4>
              <p className={styles.pillarDesc}>
                Coalescing diverse perspectives and skills to build impactful, real-world tech solutions.
              </p>
            </div>
            <div className={styles.pillarCard}>
              <Award className={styles.pillarIcon} size={38} />
              <h4 className={styles.pillarHeading}>Accelerator Mentorship</h4>
              <p className={styles.pillarDesc}>
                Providing structural pathways and professional resources to kickstart engineering careers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ChairpersonSection />

      <LogoScrollWrapper />
    </SmoothScrollProvider>
  );
}
