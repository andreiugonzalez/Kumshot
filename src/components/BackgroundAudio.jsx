import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export default function BackgroundAudio() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.6; // 60% Volume
    }
  }, []);

  // Try autoplay on mount
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const attemptPlay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        // Browser blocked autoplay without user interaction
        setIsPlaying(false);
      }
    };

    attemptPlay();

    // Start audio on first user click anywhere on page
    const handleFirstInteraction = () => {
      if (audio.paused) {
        audio.play().then(() => {
          setIsPlaying(true);
          setHasInteracted(true);
        }).catch(() => {});
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  const togglePlayMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.volume = 0.6;
      audio.muted = false;
      audio.play().then(() => {
        setIsPlaying(true);
        setIsMuted(false);
      }).catch((e) => console.log('Playback blocked:', e));
    } else if (audio.muted || isMuted) {
      audio.muted = false;
      setIsMuted(false);
      setIsPlaying(true);
    } else {
      // Mute/pause toggle
      audio.muted = true;
      setIsMuted(true);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/musicafondo.mpeg"
        loop
        preload="auto"
      />

      {/* Floating Audio Control Button */}
      <div className="fixed bottom-6 right-6 z-[90] flex items-center gap-3">
        {/* Animated Equalizer Bars when active */}
        {isPlaying && !isMuted && (
          <div className="hidden sm:flex items-end gap-1 h-5 px-3 py-1 bg-black/90 border border-accent/60 brutalist-panel">
            <span className="w-1 bg-accent h-full animate-[bounce_0.8s_infinite_ease-in-out]"></span>
            <span className="w-1 bg-accent h-3/4 animate-[bounce_0.6s_infinite_ease-in-out_0.2s]"></span>
            <span className="w-1 bg-accent h-full animate-[bounce_1s_infinite_ease-in-out_0.4s]"></span>
            <span className="w-1 bg-accent h-1/2 animate-[bounce_0.7s_infinite_ease-in-out_0.1s]"></span>
          </div>
        )}

        <button
          onClick={togglePlayMute}
          title={isPlaying && !isMuted ? 'Silenciar música de fondo (60%)' : 'Activar música de fondo'}
          className={`group relative p-3.5 rounded-none font-black transition-all duration-300 flex items-center gap-2 border-2 brutalist-panel shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_rgba(255,0,0,1)] hover:-translate-y-1 ${
            isPlaying && !isMuted
              ? 'bg-accent text-black border-black hover:bg-white'
              : 'bg-primary-900 text-white/70 border-white/30 hover:border-accent hover:text-white'
          }`}
        >
          {isPlaying && !isMuted ? (
            <>
              <Volume2 size={22} className="animate-pulse" />
              <span className="hidden md:inline font-black text-xs uppercase tracking-widest">
                MÚSICA ON (60%)
              </span>
            </>
          ) : (
            <>
              <VolumeX size={22} className="text-accent" />
              <span className="hidden md:inline font-black text-xs uppercase tracking-widest">
                MÚSICA OFF
              </span>
            </>
          )}

          {/* Hover Glow Effect */}
          <span className="absolute -inset-1 bg-accent/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity -z-10"></span>
        </button>
      </div>
    </>
  );
}
