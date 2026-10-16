import React, {
  type ComponentPropsWithoutRef,
  createContext,
  type ReactNode,
  useContext,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, Loader2 } from 'lucide-react';

export type ReceiptPrinterStage = 'processing' | 'printing' | 'complete';
export type ReceiptFeedMotion = 'smooth' | 'stepped';

export type ReceiptPrinterRootProps = Omit<
  ComponentPropsWithoutRef<'section'>,
  'children'
> & {
  /** Disables all stage transitions when false. */
  animate?: boolean;
  children: ReactNode;
  /** Controls whether the paper feeds continuously or one line at a time. */
  feedMotion?: ReceiptFeedMotion;
  /** Current state of the printer. */
  stage: ReceiptPrinterStage;
  /** When true (default), ensures thermal printer animation runs on mobile devices regardless of OS battery-saver or reduce-motion flags. */
  forceMotion?: boolean;
};

export type ReceiptPrinterMachineProps = ComponentPropsWithoutRef<'div'>;
export type ReceiptPrinterHeaderProps = ComponentPropsWithoutRef<'div'>;
export type ReceiptPrinterScreenProps = ComponentPropsWithoutRef<'div'>;
export type ReceiptPrinterOutputProps = ComponentPropsWithoutRef<'div'>;
export type ReceiptPrinterPaperProps = ComponentPropsWithoutRef<'article'>;

export type ReceiptPrinterStatusProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children'
> & {
  /** Custom status content. Defaults to a label derived from the current stage. */
  children?: ReactNode;
};

type ReceiptPrinterContextValue = {
  animate: boolean;
  feedMotion: ReceiptFeedMotion;
  shouldMove: boolean;
  stage: ReceiptPrinterStage;
};

const ReceiptPrinterContext = createContext<ReceiptPrinterContextValue | null>(null);

const easeOut = [0.23, 1, 0.32, 1] as const;
const easeInOut = [0.77, 0, 0.175, 1] as const;

// Serrated receipt cutting teeth
const receiptToothCount = 36;
const receiptToothDepth = 4;
const receiptToothPoints = Array.from(
  { length: receiptToothCount * 2 },
  (_, index) => {
    const x = 100 - ((index + 1) * 100) / (receiptToothCount * 2);
    const y = index % 2 === 0 ? '100%' : `calc(100% - ${receiptToothDepth}px)`;
    return `${x}% ${y}`;
  }
).join(', ');
export const receiptClipPath = `polygon(0 0, 100% 0, 100% calc(100% - ${receiptToothDepth}px), ${receiptToothPoints})`;

// Stepped feed keyframes mimicking a physical stepper motor feed
const printingTransformKeyframes = [
  'translateY(calc(-100% + 2px))',
  'translateY(-91%)',
  'translateY(-91%)',
  'translateY(-81%)',
  'translateY(-81%)',
  'translateY(-70%)',
  'translateY(-70%)',
  'translateY(-58%)',
  'translateY(-58%)',
  'translateY(-45%)',
  'translateY(-45%)',
  'translateY(-32%)',
  'translateY(-32%)',
  'translateY(-20%)',
  'translateY(-20%)',
  'translateY(-10%)',
  'translateY(-10%)',
  'translateY(-3%)',
  'translateY(-3%)',
  'translateY(0%)',
];

const printingKeyframeTimes = [
  0, 0.075, 0.105, 0.18, 0.21, 0.285, 0.315, 0.39, 0.42, 0.495, 0.525, 0.6,
  0.63, 0.705, 0.735, 0.81, 0.84, 0.915, 0.945, 1,
];

const statusLabels: Record<ReceiptPrinterStage, ReactNode> = {
  processing: 'Processing transaction...',
  printing: 'Printing thermal receipt...',
  complete: 'Receipt printed successfully',
};

function useReceiptPrinter(component: string) {
  const context = useContext(ReceiptPrinterContext);
  if (!context) {
    throw new Error(`${component} must be used inside ReceiptPrinter.Root.`);
  }
  return context;
}

function ReceiptPrinterRoot({
  'aria-label': ariaLabel = 'Thermal Receipt Printer',
  animate = true,
  children,
  className = '',
  feedMotion = 'stepped',
  stage,
  forceMotion = true,
  ...props
}: ReceiptPrinterRootProps) {
  const shouldReduceMotion = useReducedMotion();
  const shouldMove = animate && (forceMotion ? true : !shouldReduceMotion);
  const context: ReceiptPrinterContextValue = {
    animate,
    feedMotion,
    shouldMove,
    stage,
  };

  return (
    <ReceiptPrinterContext.Provider value={context}>
      <section
        aria-label={ariaLabel}
        className={`relative isolate flex w-full max-w-sm flex-col items-center mx-auto ${className}`}
        data-stage={stage}
        {...props}
      >
        {children}
      </section>
    </ReceiptPrinterContext.Provider>
  );
}

function ReceiptPrinterMachine({
  children,
  className = '',
  ...props
}: ReceiptPrinterMachineProps) {
  return (
    <div
      className={`relative isolate w-full overflow-hidden rounded-2xl border border-zinc-800 bg-linear-to-b from-zinc-900 via-zinc-950 to-black p-3.5 pb-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.8)] ${className}`}
      {...props}
    >
      {children}
      {/* Printer paper exit slit */}
      <div
        aria-hidden="true"
        className="absolute inset-x-7 bottom-2 z-40 h-2 rounded-xs border border-zinc-950 bg-zinc-950 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] flex items-center justify-center"
      >
        <div className="w-16 h-0.5 bg-zinc-800/60 rounded-full" />
      </div>
    </div>
  );
}

function ReceiptPrinterHeader({
  children,
  className = '',
  ...props
}: ReceiptPrinterHeaderProps) {
  return (
    <div
      className={`relative z-10 flex h-8 items-center justify-between pb-1 px-1 border-b border-zinc-800/80 mb-2.5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function ReceiptPrinterScreen({
  children,
  className = '',
  ...props
}: ReceiptPrinterScreenProps) {
  return (
    <div
      className={`relative z-10 isolate overflow-hidden rounded-xl border border-zinc-800/90 bg-zinc-950/90 p-3 text-zinc-100 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] ${className}`}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function StatusIndicator({
  animate,
  stage,
}: {
  animate: boolean;
  move: boolean;
  stage: ReceiptPrinterStage;
}) {
  const isComplete = stage === 'complete';

  return (
    <span
      aria-hidden="true"
      className="relative grid size-5 shrink-0 place-items-center"
    >
      <AnimatePresence initial={false} mode="sync">
        {isComplete ? (
          <motion.span
            animate={{ opacity: 1, scale: 1 }}
            className="col-start-1 row-start-1 grid place-items-center text-emerald-400"
            exit={{ opacity: animate ? 0 : 1, scale: 0.95 }}
            initial={{ opacity: animate ? 0 : 1, scale: 0.9 }}
            key="complete"
            transition={{ duration: animate ? 0.2 : 0, ease: easeOut }}
          >
            <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-emerald-400 stroke-[3]" />
            </div>
          </motion.span>
        ) : (
          <motion.span
            animate={{ opacity: 1, scale: 1 }}
            className="col-start-1 row-start-1 grid place-items-center text-emerald-400"
            exit={{ opacity: animate ? 0 : 1, scale: 0.95 }}
            initial={{ opacity: animate ? 0 : 1, scale: 0.9 }}
            key="working"
            transition={{ duration: animate ? 0.2 : 0, ease: easeOut }}
          >
            <Loader2
              className={`w-3.5 h-3.5 text-emerald-400 ${
                animate ? 'animate-spin' : ''
              }`}
            />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function ReceiptPrinterStatus({
  children,
  className = '',
  ...props
}: ReceiptPrinterStatusProps) {
  const { animate, shouldMove, stage } = useReceiptPrinter('ReceiptPrinter.Status');

  return (
    <div
      className={`flex min-w-0 items-center gap-2.5 ${className}`}
      {...props}
    >
      <StatusIndicator animate={animate} move={shouldMove} stage={stage} />
      <div
        aria-live="polite"
        className="grid min-w-0 flex-1 items-center font-mono"
        role="status"
      >
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="col-start-1 row-start-1 truncate font-mono text-xs tracking-tight text-zinc-300 font-medium"
            exit={{
              opacity: animate ? 0 : 1,
              y: shouldMove ? -4 : 0,
            }}
            initial={{
              opacity: animate ? 0 : 1,
              y: shouldMove ? 4 : 0,
            }}
            key={stage}
            transition={{ duration: animate ? 0.2 : 0, ease: easeOut }}
          >
            {children ?? statusLabels[stage]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ReceiptPrinterPaper({
  children,
  className = '',
  style,
  ...props
}: ReceiptPrinterPaperProps) {
  return (
    <article
      className={`relative z-10 w-full bg-[#fdfdfc] text-zinc-900 px-5 pt-6 pb-8 font-mono shadow-[0_12px_32px_rgba(0,0,0,0.18),0_2px_6px_rgba(0,0,0,0.08)] border-x border-zinc-200/80 ${className}`}
      style={{ clipPath: receiptClipPath, ...style }}
      {...props}
    >
      {/* Subtle thermal paper surface sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-white/40 to-transparent opacity-60"
      />
      <div className="relative z-10">{children}</div>
    </article>
  );
}

function ReceiptPrinterOutput({
  children,
  className = '',
  ...props
}: ReceiptPrinterOutputProps) {
  const { animate, feedMotion, shouldMove, stage } = useReceiptPrinter('ReceiptPrinter.Output');
  const isReceiptVisible = stage !== 'processing';
  const shouldUseSteppedFeed =
    feedMotion === 'stepped' && stage === 'printing' && shouldMove;

  return (
    <div
      className={`relative z-30 -mt-2.5 w-[calc(100%-1.5rem)] max-w-full overflow-hidden px-2 pt-1 pb-4 ${className}`}
      {...props}
    >
      {/* Shadow cast from machine slit onto emerging paper */}
      {isReceiptVisible ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-4 top-0 z-40 h-2.5 bg-gradient-to-b from-black/80 to-transparent blur-[2px]"
        />
      ) : null}

      <motion.div
        animate={{
          opacity: isReceiptVisible ? 1 : 0,
          transform:
            stage === 'printing' && shouldMove
              ? shouldUseSteppedFeed
                ? printingTransformKeyframes
                : 'translateY(0%)'
              : isReceiptVisible || !shouldMove
                ? 'translateY(0%)'
                : 'translateY(calc(-100% + 2px))',
        }}
        aria-hidden={stage !== 'complete'}
        className="relative isolate will-change-transform transform-gpu"
        initial={false}
        transition={{
          opacity: { duration: animate ? 0.16 : 0, ease: easeOut },
          transform: {
            duration: shouldMove ? 1.8 : 0,
            ease: shouldUseSteppedFeed ? 'linear' : easeInOut,
            times: shouldUseSteppedFeed ? printingKeyframeTimes : undefined,
          },
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export const ReceiptPrinter = {
  Header: ReceiptPrinterHeader,
  Machine: ReceiptPrinterMachine,
  Output: ReceiptPrinterOutput,
  Paper: ReceiptPrinterPaper,
  Root: ReceiptPrinterRoot,
  Screen: ReceiptPrinterScreen,
  Status: ReceiptPrinterStatus,
};
