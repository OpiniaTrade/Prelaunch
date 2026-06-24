import AnimatedSection from "./components/AnimatedSection";
import ScrollTabs from "./components/ScrollTabs";
import CustomCursor from "./components/CustomCursor";
import MagneticButton from "./components/MagneticButton";
import TextScramble from "./components/TextScramble";
import MarqueeStrip from "./components/MarqueeStrip";
import ParallaxText from "./components/ParallaxText";
import InteractiveCard from "./components/InteractiveCard";
import ScrollProgress from "./components/ScrollProgress";
import RopeCharacter from "./components/RopeCharacter";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Desktop-only interactive elements */}
      <div className="hidden md:block">
        <CustomCursor />
        <RopeCharacter />
      </div>
      <ScrollProgress />

      {/* Top Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 bg-white/90 backdrop-blur-md border-b border-[var(--color-hairline)]"
        style={{ height: 56, marginTop: 3 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[22px] font-[700] tracking-tight">OPINIA</span>
        </div>
        <div className="flex items-center gap-3">
          <MagneticButton
            href="#"
            className="hidden sm:inline-flex items-center justify-center px-3 py-1.5 md:px-5 md:py-2 rounded-full bg-white text-black text-body-sm md:text-button border border-[var(--color-hairline)]"
          >
            Contact
          </MagneticButton>
          <MagneticButton
            href="#"
            className="items-center justify-center px-3 py-1.5 md:px-5 md:py-2.5 rounded-full bg-black text-white text-body-sm md:text-button"
          >
            Join Waitlist
          </MagneticButton>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen md:h-screen flex flex-col items-center justify-center text-center px-6 md:px-8 py-20 md:py-0">
        <AnimatedSection variant="fade-down" delay={200}>
          <p className="text-eyebrow mb-6 text-[var(--color-ink)]">
            <TextScramble text="THE FUTURE OF CREATOR ECONOMY" />
          </p>
        </AnimatedSection>

        <AnimatedSection variant="blur-in" delay={400}>
          <h1 className="text-display-xl max-w-4xl mb-6">
            Turn predictions into{" "}
            <span className="text-[var(--color-accent-magenta)]">
              real-world rewards
            </span>
          </h1>
        </AnimatedSection>

        <AnimatedSection variant="fade-up" delay={600}>
          <p className="text-body-lg max-w-2xl mb-10 text-[var(--color-ink)]">
            Predict the future, capitalize on the creativity of your favorite
            creators. Earn exclusive rewards, VIP show tickets and access
            exclusive content and streams by showing your fandom.
          </p>
        </AnimatedSection>

        <AnimatedSection variant="scale-up" delay={800}>
          <div className="flex flex-col sm:flex-row gap-4">
            <MagneticButton
              href="#"
              className="items-center justify-center px-7 py-3 rounded-full bg-black text-white text-button"
            >
              Get Early Access
            </MagneticButton>
            <MagneticButton
              href="#"
              className="items-center justify-center px-7 py-3 rounded-full bg-white text-black text-button border border-[var(--color-hairline)]"
            >
              Learn More
            </MagneticButton>
          </div>
        </AnimatedSection>

        {/* Scroll indicator */}
        <AnimatedSection variant="fade-up" delay={1200} className="mt-16">
          <div className="flex flex-col items-center gap-2 opacity-50">
            <span className="text-caption">SCROLL</span>
            <div className="w-[1px] h-8 bg-[var(--color-ink)] animate-pulse" />
          </div>
        </AnimatedSection>
      </section>

      {/* Marquee Strip */}
      <MarqueeStrip />

      {/* Prediction Cards Section */}
      <section className="min-h-screen md:h-screen w-full px-6 md:px-8 flex flex-col items-center justify-center max-w-[1280px] mx-auto py-20 md:py-0">
        <AnimatedSection variant="fade-up" className="mb-12 text-center">
          <p className="text-eyebrow mb-4">LIVE PREDICTIONS</p>
          <h2 className="text-display-lg">What will happen next?</h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Card 1: Carryminati - Green / YES */}
          <AnimatedSection variant="fade-right" delay={100}>
            <InteractiveCard className="rounded-[24px] bg-[var(--color-surface-soft)] border border-[var(--color-hairline)] p-6 md:p-8 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <span className="text-eyebrow text-sm">PREDICTION MARKET</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#d4f5d4] text-[var(--color-semantic-success)] text-xs font-[500]">
                  ACTIVE
                </span>
              </div>
              <h3 className="text-headline mb-2">
                Will Carryminati post a new video in July 2026?
              </h3>
              <p className="text-body-sm text-[var(--color-ink)] mb-6 opacity-70">
                Trending creator prediction · Ends July 31, 2026
              </p>

              <div className="flex-1 flex items-end mb-6">
                <svg
                  viewBox="0 0 300 80"
                  className="w-full h-20"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="greenGradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#1ea64a" stopOpacity="0.3" />
                      <stop
                        offset="100%"
                        stopColor="#1ea64a"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,60 C20,55 40,50 60,45 C80,40 100,42 120,35 C140,28 160,30 180,22 C200,18 220,20 240,15 C260,12 280,8 300,5"
                    fill="none"
                    stroke="#1ea64a"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M0,60 C20,55 40,50 60,45 C80,40 100,42 120,35 C140,28 160,30 180,22 C200,18 220,20 240,15 C260,12 280,8 300,5 L300,80 L0,80 Z"
                    fill="url(#greenGradient)"
                  />
                </svg>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-caption mb-1">YES</span>
                    <span className="text-[28px] font-[600] text-[var(--color-semantic-success)]">
                      78%
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-caption mb-1">NO</span>
                    <span className="text-[28px] font-[600] text-[var(--color-ink)] opacity-40">
                      22%
                    </span>
                  </div>
                </div>
                <button
                  data-interactive
                  className="px-5 py-2.5 rounded-full bg-[var(--color-semantic-success)] text-white text-button text-sm"
                >
                  Predict YES
                </button>
              </div>
            </InteractiveCard>
          </AnimatedSection>

          {/* Card 2: Dhoni - Red / NO */}
          <AnimatedSection variant="fade-left" delay={250}>
            <InteractiveCard className="rounded-[24px] bg-[var(--color-surface-soft)] border border-[var(--color-hairline)] p-6 md:p-8 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <span className="text-eyebrow text-sm">PREDICTION MARKET</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#fde2e2] text-[#d32f2f] text-xs font-[500]">
                  ACTIVE
                </span>
              </div>
              <h3 className="text-headline mb-2">
                Will Mahendra Singh Dhoni retire in 2035?
              </h3>
              <p className="text-body-sm text-[var(--color-ink)] mb-6 opacity-70">
                Sports prediction · Ends Dec 31, 2035
              </p>

              <div className="flex-1 flex items-end mb-6">
                <svg
                  viewBox="0 0 300 80"
                  className="w-full h-20"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="redGradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#d32f2f" stopOpacity="0.3" />
                      <stop
                        offset="100%"
                        stopColor="#d32f2f"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,15 C20,18 40,20 60,28 C80,35 100,32 120,40 C140,45 160,42 180,50 C200,55 220,52 240,58 C260,62 280,65 300,68"
                    fill="none"
                    stroke="#d32f2f"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M0,15 C20,18 40,20 60,28 C80,35 100,32 120,40 C140,45 160,42 180,50 C200,55 220,52 240,58 C260,62 280,65 300,68 L300,80 L0,80 Z"
                    fill="url(#redGradient)"
                  />
                </svg>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-caption mb-1">YES</span>
                    <span className="text-[28px] font-[600] text-[#d32f2f]">
                      34%
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-caption mb-1">NO</span>
                    <span className="text-[28px] font-[600] text-[var(--color-ink)]">
                      66%
                    </span>
                  </div>
                </div>
                <button
                  data-interactive
                  className="px-5 py-2.5 rounded-full bg-[#d32f2f] text-white text-button text-sm"
                >
                  Predict NO
                </button>
              </div>
            </InteractiveCard>
          </AnimatedSection>
        </div>
      </section>

      {/* Color Block: Welcome / Value Prop */}
      <section className="min-h-screen md:h-screen w-full px-6 md:px-8 flex items-center justify-center max-w-[1280px] mx-auto py-20 md:py-0">
        <AnimatedSection variant="scale-up" className="w-full">
          <div className="rounded-[24px] bg-[var(--color-block-lilac)] p-12 md:p-16 text-center">
            <p className="text-eyebrow mb-4">WELCOME TO THE FUTURE</p>
            <ParallaxText speed={0.15}>
              <h2 className="text-display-lg max-w-3xl mx-auto mb-6">
                You&apos;re not just a consumer — you&apos;re an{" "}
                <span className="text-[var(--color-accent-magenta)]">
                  active participant
                </span>
                .
              </h2>
            </ParallaxText>
            <p className="text-body-lg max-w-2xl mx-auto">
              Welcome to the future of the creator economy. Predict outcomes
              about your favorite creators and earn real rewards for your
              knowledge and fandom.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* How It Works — Scroll-driven Tabs */}
      <ScrollTabs />

      {/* Color Block: Rewards */}
      <section className="min-h-screen md:h-screen w-full px-6 md:px-8 flex items-center justify-center max-w-[1280px] mx-auto py-20 md:py-0">
        <AnimatedSection variant="fade-up" className="w-full">
          <div className="rounded-[24px] bg-[var(--color-block-lime)] p-12 md:p-16">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-eyebrow mb-4">REWARDS</p>
              <h2 className="text-display-lg mb-8">
                Real rewards for real fans
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                <InteractiveCard className="bg-white/60 rounded-[16px] p-6">
                  <h4 className="text-headline mb-2">🎟️ VIP Tickets</h4>
                  <p className="text-body">
                    Get exclusive access to creator shows and events.
                  </p>
                </InteractiveCard>
                <InteractiveCard className="bg-white/60 rounded-[16px] p-6">
                  <h4 className="text-headline mb-2">🎬 Exclusive Content</h4>
                  <p className="text-body">
                    Unlock behind-the-scenes videos, early releases, and more.
                  </p>
                </InteractiveCard>
                <InteractiveCard className="bg-white/60 rounded-[16px] p-6">
                  <h4 className="text-headline mb-2">📺 Private Streams</h4>
                  <p className="text-body">
                    Join exclusive live sessions with your favorite creators.
                  </p>
                </InteractiveCard>
                <InteractiveCard className="bg-white/60 rounded-[16px] p-6">
                  <h4 className="text-headline mb-2">🏆 Leaderboard Status</h4>
                  <p className="text-body">
                    Build your reputation as the ultimate fan predictor.
                  </p>
                </InteractiveCard>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Placeholder Section 1 */}
      {/* <section className="h-screen w-full px-6 md:px-8 flex items-center justify-center max-w-[1280px] mx-auto">
        <AnimatedSection variant="blur-in" className="w-full">
          <div className="rounded-[24px] border-2 border-dashed border-[var(--color-hairline)] p-12 md:p-16 min-h-[400px] flex items-center justify-center">
            <p className="text-body-lg text-[var(--color-ink)] opacity-40">
              Content coming soon — reserved section
            </p>
          </div>
        </AnimatedSection>
      </section> */}

      {/* Placeholder Section 2 */}
      {/* <section className="h-screen w-full px-6 md:px-8 flex items-center justify-center max-w-[1280px] mx-auto">
        <AnimatedSection variant="blur-in" delay={100} className="w-full">
          <div className="rounded-[24px] border-2 border-dashed border-[var(--color-hairline)] p-12 md:p-16 min-h-[400px] flex items-center justify-center">
            <p className="text-body-lg text-[var(--color-ink)] opacity-40">
              Content coming soon — reserved section
            </p>
          </div>
        </AnimatedSection>
      </section> */}

      {/* CTA Color Block */}
      <section className="min-h-screen md:h-screen w-full px-6 md:px-8 flex items-center justify-center max-w-[1280px] mx-auto py-20 md:py-0">
        <AnimatedSection variant="scale-up" className="w-full">
          <div className="rounded-[24px] bg-[var(--color-block-navy)] p-12 md:p-16 text-center">
            <p className="text-eyebrow text-[var(--color-inverse-ink)] mb-4">
              EARLY ACCESS
            </p>
            <ParallaxText speed={0.1}>
              <h2 className="text-display-lg text-[var(--color-inverse-ink)] max-w-3xl mx-auto mb-6">
                Be the first to predict the future
              </h2>
            </ParallaxText>
            <p className="text-body-lg text-[var(--color-inverse-ink)] opacity-80 max-w-xl mx-auto mb-10">
              Join the waitlist and get early access to Opinia. Shape the future
              of the creator economy.
            </p>
            <MagneticButton
              href="#"
              className="items-center justify-center px-8 py-3.5 rounded-full bg-white text-black text-button"
            >
              Join the Waitlist
            </MagneticButton>
          </div>
        </AnimatedSection>
      </section>

      {/* Second Marquee */}
      <MarqueeStrip />

      {/* Footer */}
      <AnimatedSection variant="fade-up">
        <footer className="w-full border-t border-[var(--color-hairline)] px-6 md:px-8 py-6 md:py-12">
          <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[18px] font-[700] tracking-tight">
                OPINIA
              </span>
            </div>
            <p className="text-caption text-[var(--color-ink)] opacity-80">
              © 2026 OPINIA. ALL RIGHTS RESERVED.
            </p>
          </div>
        </footer>
      </AnimatedSection>
    </div>
  );
}
