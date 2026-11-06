import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatedButton, Typewriter } from '@codetikki/animations';

interface ReelDemoProps {
  /** Scene 1 — the animation, shown full-frame. */
  children: ReactNode;
  /** Scene 2 — code that gets typed out on screen. */
  code: string;
  /** Small text pinned to the bottom of the animation scene. */
  caption?: string;
  /** Ms per scene. The reel loops scene 1 → scene 2 → scene 1 … */
  sceneDuration?: number;
  /** Narrated explanation — en is required, hi optional. */
  explainer?: { en: string; hi?: string };
}

type Lang = 'en' | 'hi';

function speak(text: string, lang: Lang) {
  if (typeof speechSynthesis === 'undefined') return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
  const voices = speechSynthesis.getVoices();
  const match = voices.find((v) =>
    v.lang.toLowerCase().startsWith(lang === 'hi' ? 'hi' : 'en'),
  );
  if (match) u.voice = match;
  speechSynthesis.speak(u);
}

/**
 * Button that opens a reel-style 9:16 player: plays the animation, then
 * types out the creation code — story progress bars, auto-loop, Esc to close.
 */
export function ReelDemo({ children, code, caption, explainer, sceneDuration = 5000 }: ReelDemoProps) {
  const [open, setOpen] = useState(false);
  const [scene, setScene] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [lang, setLang] = useState<Lang>('en');
  const [muted, setMuted] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    setScene(0);
    setCycle(0);
    if (explainer && !muted) speak(explainer[lang] ?? explainer.en, lang);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      window.speechSynthesis?.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      setScene((s) => {
        if (s === 1) setCycle((c) => c + 1);
        return (s + 1) % 2;
      });
    }, sceneDuration);
    return () => clearTimeout(timer);
  }, [open, scene, sceneDuration]);

  return (
    <>
      <AnimatedButton variant="outline" onClick={() => setOpen(true)}>
        ▶ Reel
      </AnimatedButton>
      {open &&
        createPortal(
          <div
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              background: 'rgba(2, 2, 10, 0.85)',
              backdropFilter: 'blur(6px)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: 20,
                right: 24,
                background: 'none',
                border: '1px solid #334155',
                borderRadius: 8,
                color: '#94a3b8',
                fontSize: 16,
                width: 34,
                height: 34,
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
            {/* 9:16 reel frame */}
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                height: 'min(80vh, 660px)',
                aspectRatio: '9 / 16',
                borderRadius: 24,
                border: '1px solid #334155',
                background: '#0d0d17',
                boxShadow: '0 0 80px #6366f140',
                overflow: 'hidden',
              }}
            >
              {/* narration controls */}
              {explainer && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: 'absolute',
                    top: 24,
                    left: 12,
                    right: 12,
                    display: 'flex',
                    justifyContent: 'space-between',
                    zIndex: 4,
                  }}
                >
                  <button
                    onClick={() => {
                      if (muted) {
                        setMuted(false);
                        speak(explainer[lang] ?? explainer.en, lang);
                      } else {
                        setMuted(true);
                        speechSynthesis?.cancel();
                      }
                    }}
                    aria-label={muted ? 'Unmute narration' : 'Mute narration'}
                    style={{
                      background: 'rgba(20,20,34,0.7)',
                      border: '1px solid #334155',
                      borderRadius: 8,
                      color: '#e2e8f0',
                      fontSize: 14,
                      width: 32,
                      height: 32,
                      cursor: 'pointer',
                    }}
                  >
                    {muted ? '🔇' : '🔊'}
                  </button>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {(['en', 'hi'] as Lang[]).map((l) =>
                      l === 'hi' && !explainer.hi ? null : (
                        <button
                          key={l}
                          onClick={() => {
                            setLang(l);
                            if (!muted) speak(explainer[l] ?? explainer.en, l);
                          }}
                          style={{
                            background:
                              lang === l ? 'rgba(129,140,248,0.25)' : 'rgba(20,20,34,0.7)',
                            border: `1px solid ${lang === l ? '#818cf8' : '#334155'}`,
                            borderRadius: 8,
                            color: lang === l ? '#c7d2fe' : '#94a3b8',
                            fontSize: 11,
                            fontWeight: 700,
                            padding: '0 10px',
                            height: 32,
                            cursor: 'pointer',
                          }}
                        >
                          {l === 'en' ? 'EN' : 'हिं'}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* story progress bars */}
              <div
                style={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  right: 12,
                  display: 'flex',
                  gap: 6,
                  zIndex: 3,
                }}
              >
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: 3,
                      borderRadius: 2,
                      background: '#33415577',
                      overflow: 'hidden',
                    }}
                  >
                    {i < scene && (
                      <div style={{ height: '100%', width: '100%', background: '#e2e8f0' }} />
                    )}
                    {i === scene && (
                      <div
                        key={`fill-${cycle}-${scene}`}
                        style={{
                          height: '100%',
                          width: 0,
                          background: '#e2e8f0',
                          animation: `reel-progress ${sceneDuration}ms linear forwards`,
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* scene 1 — animation */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'grid',
                  placeItems: 'center',
                  opacity: scene === 0 ? 1 : 0,
                  transition: 'opacity 0.45s ease',
                }}
              >
                {children}
                {caption ? (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 26,
                      left: 12,
                      right: 12,
                      textAlign: 'center',
                      fontSize: 12,
                      color: '#64748b',
                      letterSpacing: 1.5,
                      textTransform: 'uppercase',
                    }}
                  >
                    {caption}
                  </div>
                ) : null}
                {explainer && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 48,
                      left: 16,
                      right: 16,
                      textAlign: 'center',
                      fontSize: 12.5,
                      lineHeight: 1.5,
                      color: '#94a3b8',
                    }}
                  >
                    {explainer[lang] ?? explainer.en}
                  </div>
                )}
              </div>

              {/* scene 2 — how to create */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '48px 16px 24px',
                  opacity: scene === 1 ? 1 : 0,
                  transition: 'opacity 0.45s ease',
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: '#64748b',
                    letterSpacing: 2.5,
                    textTransform: 'uppercase',
                    marginBottom: 10,
                  }}
                >
                  How to create
                </div>
                <div
                  style={{
                    flex: 1,
                    background: '#0a0a14',
                    border: '1px solid #1e293b',
                    borderRadius: 12,
                    padding: 14,
                    overflow: 'hidden',
                  }}
                >
                  <Typewriter
                    key={`${cycle}-${scene}`}
                    text={code}
                    speed={22}
                    style={{
                      fontFamily: 'ui-monospace, Consolas, monospace',
                      fontSize: 11.5,
                      lineHeight: 1.75,
                      color: '#a5b4fc',
                      whiteSpace: 'pre-wrap',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
