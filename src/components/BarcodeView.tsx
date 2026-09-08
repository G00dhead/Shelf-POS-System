import React from 'react';

interface BarcodeViewProps {
  code: string;
  height?: number;
  showText?: boolean;
  className?: string;
  barColor?: string;
}

/**
 * Deterministic pseudo-code barcode generator that renders real scannable-looking
 * variable-width vertical bars in crisp SVG format.
 */
export const BarcodeView: React.FC<BarcodeViewProps> = ({
  code,
  height = 36,
  showText = true,
  className = '',
  barColor = '#18181b'
}) => {
  // Generate pseudo-random deterministic bar patterns based on characters
  const bars = React.useMemo(() => {
    const cleanCode = code || '6151100000000';
    const pattern: { x: number; width: number }[] = [];
    let currentX = 4; // quiet zone

    // Lead guard pattern: 1 0 1
    pattern.push({ x: currentX, width: 2 });
    currentX += 4;
    pattern.push({ x: currentX, width: 2 });
    currentX += 4;

    for (let i = 0; i < cleanCode.length; i++) {
      const charCode = cleanCode.charCodeAt(i);
      const w1 = (charCode % 3) + 1;
      const space1 = ((charCode >> 1) % 3) + 2;
      const w2 = ((charCode >> 2) % 2) + 1;
      const space2 = ((charCode >> 3) % 2) + 2;

      pattern.push({ x: currentX, width: w1 });
      currentX += w1 + space1;
      pattern.push({ x: currentX, width: w2 });
      currentX += w2 + space2;
    }

    // Center guard pattern
    pattern.push({ x: currentX, width: 2 });
    currentX += 4;
    pattern.push({ x: currentX, width: 2 });
    currentX += 4;

    // End guard pattern: 1 0 1
    pattern.push({ x: currentX, width: 2 });
    currentX += 4;
    pattern.push({ x: currentX, width: 2 });
    currentX += 6;

    return { pattern, totalWidth: currentX };
  }, [code]);

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg
        viewBox={`0 0 ${bars.totalWidth} ${height}`}
        style={{ width: '100%', height: `${height}px`, maxWidth: `${bars.totalWidth * 1.5}px` }}
        preserveAspectRatio="none"
        className="overflow-visible"
        aria-label={`Barcode: ${code}`}
      >
        <rect width={bars.totalWidth} height={height} fill="transparent" />
        {bars.pattern.map((bar, index) => (
          <rect
            key={index}
            x={bar.x}
            y={0}
            width={bar.width}
            height={height}
            fill={barColor}
          />
        ))}
      </svg>
      {showText && (
        <div className="font-mono text-[10px] tracking-[0.2em] font-semibold text-zinc-700 mt-1">
          {code}
        </div>
      )}
    </div>
  );
};

interface BarcodeLabelProps {
  name: string;
  sku: string;
  barcode: string;
  price: number;
  currency?: string;
  onClose?: () => void;
}

export const BarcodeLabelModal: React.FC<BarcodeLabelProps> = ({
  name,
  sku,
  barcode,
  price,
  currency = '₦',
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl border border-zinc-200 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Shelf Barcode Tag
          </h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-600 text-xs font-semibold px-2 py-1 rounded"
            >
              Close
            </button>
          )}
        </div>

        {/* Realistic Retail Shelf Tag */}
        <div className="border-2 border-dashed border-zinc-300 rounded-xl p-4 bg-zinc-50 flex flex-col items-center text-center space-y-2">
          <div className="text-[10px] font-bold text-[#6D5AE6] uppercase tracking-widest">
            Shelf
          </div>
          <div className="text-xs font-bold text-zinc-900 line-clamp-2">
            {name}
          </div>
          <div className="text-[11px] font-mono text-zinc-500">
            SKU: {sku}
          </div>

          <div className="w-full py-2 flex justify-center bg-white rounded-lg border border-zinc-200 px-2">
            <BarcodeView code={barcode} height={44} />
          </div>

          <div className="pt-1">
            <span className="text-[10px] text-zinc-400 font-medium">RETAIL PRICE: </span>
            <span className="text-base font-extrabold text-zinc-900 font-mono">
              {currency}{price.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="flex-1 py-2 text-xs font-semibold text-white bg-[#6D5AE6] hover:bg-[#5E4BD4] rounded-lg transition-colors cursor-pointer text-center"
          >
            Print Shelf Label
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="py-2 px-3 text-xs font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg border border-zinc-200"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
