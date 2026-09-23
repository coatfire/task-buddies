import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRoutineStore } from '../store/useRoutineStore';
import PixelRexCharacter from '../components/rex/PixelRexCharacter';
import Logo from '../components/Logo';
import { CHARACTERS as characters } from '../data/characters';
import { scaled, useRootScale } from '../hooks/useRootScale';

const MotionButton = motion.button;

export default function CharacterSelection() {
  const { scale: rootScale } = useRootScale();
  const setScreen = useRoutineStore((s) => s.setScreen);
  const setSelectedCharacter = useRoutineStore((s) => s.setSelectedCharacter);
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'center', loop: true });
  const companionCount = characters.length;

  const handleSelect = (charId) => {
    setSelectedCharacter(charId);
    setScreen('picker');
  };

  return (
    <div className="h-full min-h-0 flex flex-col px-1 py-1 text-ink overflow-hidden sm:py-2">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3 shrink-0 sm:mb-5">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-auto" size="small" />
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-3 px-2 shrink-0 sm:mb-6 sm:px-4">
        <div className="hidden items-center gap-2 rounded-full border border-border-card bg-surface px-3 py-1 text-[0.625rem] uppercase tracking-[0.16em] text-ink-muted font-body shadow-soft mb-2 sm:inline-flex sm:py-1.5 sm:text-[0.6875rem] sm:mb-4">
          <span>Buddy Collection</span>
          <span className="text-ink">{companionCount} companions</span>
        </div>
        <h1 className="text-[1.45rem] leading-tight font-display font-bold text-ink mb-1 sm:text-3xl sm:mb-2">Choose Your Buddy</h1>
        <p className="hidden max-w-[18rem] mx-auto text-ink-muted text-[0.8125rem] font-body leading-snug sm:block sm:max-w-none sm:text-sm sm:leading-normal">Tap the arrows to find your buddy for today.</p>
      </div>

      {/* Carousel with arrows */}
      <div className="relative w-full max-w-sm mx-auto mb-2 flex-1 min-h-0 sm:mb-4 tablet:flex-none tablet:my-auto">
        <div className="absolute inset-8 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
        {/* Gutter arrows — sit outside the visible card area */}
        <button
          onClick={() => emblaApi?.scrollPrev()}
          aria-label="Previous buddy"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-xl bg-surface border border-border-card shadow-soft flex items-center justify-center hover:bg-surface-card transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-accent" />
        </button>
        <div className="relative flex h-full min-h-0 w-full flex-col rounded-[32px] border border-border-card bg-surface px-8 py-2.5 shadow-soft overflow-hidden sm:py-5">
          <div className="h-full min-h-0 overflow-hidden" ref={emblaRef}>
            <div className="flex h-full items-stretch">
              {characters.map((char) => (
                <div key={char.id} className="flex h-full flex-[0_0_100%] min-w-0 px-1">
                  <MotionButton
                    onClick={() => handleSelect(char.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative flex h-full min-h-[min(24rem,58dvh)] w-full flex-col items-center px-3 py-3 bg-surface-card rounded-[24px] shadow-soft border border-border-card hover:border-accent/50 transition-all overflow-visible sm:min-h-0 sm:p-6"
                  >
                    <div className="hidden self-start mb-2 rounded-full border border-border-card bg-white/60 px-3 py-1 text-[0.625rem] uppercase tracking-[0.14em] text-ink-muted font-body sm:inline-flex sm:mb-3 sm:text-[0.6875rem]">
                      Today's Guide
                    </div>
                    <div className="relative mb-3 flex w-full flex-1 items-center justify-center rounded-[20px] bg-[#FAF3E8] border border-border-card overflow-visible min-h-[min(13.5rem,30dvh)] sm:mb-4 sm:min-h-0 tablet:flex-none tablet:aspect-[4/3]">
                      <PixelRexCharacter state="celebrating" characterId={char.id} size={scaled(170, rootScale)} className="shrink-0" />
                    </div>
                    <span className="font-display font-semibold text-ink text-[1.45rem] mb-0.5 sm:text-2xl sm:mb-1">{char.name}</span>
                    <span className="text-[0.8125rem] text-ink-muted text-center font-body leading-snug sm:text-sm">{char.trait}</span>
                    <div className="mt-auto pt-3 w-full rounded-2xl bg-accent px-4 py-2.5 flex items-center justify-between sm:mt-5 sm:pt-0 sm:py-3">
                      <span className="text-xs font-display font-semibold text-ink">Choose {char.name}</span>
                      <span className="text-ink text-sm">→</span>
                    </div>
                  </MotionButton>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={() => emblaApi?.scrollNext()}
          aria-label="Next buddy"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-xl bg-surface border border-border-card shadow-soft flex items-center justify-center hover:bg-surface-card transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-accent" />
        </button>
      </div>

      <div className="max-w-sm mx-auto rounded-[24px] border border-border-card bg-surface px-3 py-2 shadow-soft text-center shrink-0 sm:px-4 sm:py-3">
        <p className="text-ink-muted text-[0.75rem] font-body leading-snug sm:text-sm sm:leading-relaxed">Each buddy brings a slightly different energy. Pick the one that feels right today.</p>
        <p className="text-ink-muted/70 text-[0.6875rem] font-body mt-1 sm:text-xs sm:mt-2">Tap the arrows to browse</p>
      </div>
    </div>
  );
}
