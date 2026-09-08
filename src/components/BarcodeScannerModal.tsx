import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, Scan, Zap, Check, AlertCircle } from 'lucide-react';
import { playBarcodeScanBeep, playScanErrorBeep } from '../utils/audio';
import { Product } from '../types';
import { DEFAULT_PRODUCT_IMAGE } from '../mockData';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (barcodeOrSku: string) => boolean; // returns true if product matched
  products: Product[];
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onScan,
  products
}) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [scanError, setScanError] = useState<string | null>(null);
  const [lastScanned, setLastScanned] = useState<{ name: string; barcode: string; time: string } | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setManualCode('');
      setScanError(null);
      setCameraError(null);
      return;
    }

    // Try starting camera when modal opens
    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera API is not supported in this browser environment. You can use Quick Simulation or manual entry.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera stream could not start:', err);
      setCameraError('Camera access restricted in preview frame. Use instant supermarket scan buttons below.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleExecuteScan = (codeToScan: string) => {
    const trimmed = codeToScan.trim();
    if (!trimmed) return;

    setScanError(null);
    const matched = onScan(trimmed);
    if (matched) {
      playBarcodeScanBeep();
      const product = products.find(
        (p) => p.barcode === trimmed || p.sku.toLowerCase() === trimmed.toLowerCase()
      );
      setLastScanned({
        name: product ? product.name : 'Unknown item',
        barcode: trimmed,
        time: new Date().toLocaleTimeString()
      });
      setManualCode('');
    } else {
      playScanErrorBeep();
      setScanError(`Barcode "${trimmed}" not found in supermarket inventory.`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-zinc-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#6D5AE6]/10 text-[#6D5AE6] flex items-center justify-center">
              <Scan className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 leading-none">
                Barcode Scanner Terminal
              </h3>
              <p className="text-[11px] text-zinc-400 mt-1">
                Scan groceries & toiletries with camera, laser, or fast tap
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          {/* Live Camera Viewfinder or Simulated Optical Reticle */}
          <div className="relative w-full aspect-16/10 bg-zinc-950 rounded-xl overflow-hidden flex items-center justify-center border border-zinc-800 shadow-inner">
            {cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="p-6 text-center text-zinc-400 space-y-2">
                <Camera className="w-10 h-10 mx-auto text-zinc-600 animate-pulse" />
                <p className="text-xs text-zinc-300 font-medium">
                  {cameraError || 'Optical Camera Viewfinder Ready'}
                </p>
                <button
                  onClick={startCamera}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Request Camera Feed</span>
                </button>
              </div>
            )}

            {/* Futuristic Red Scanning Laser Line overlay */}
            <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
              <div className="w-full h-0.5 bg-red-500 shadow-[0_0_12px_#ef4444] animate-pulse" />
              <div className="text-[10px] text-red-400 font-mono tracking-widest mt-1 uppercase font-semibold">
                Align Barcode in Aiming Field
              </div>
            </div>

            {/* Reticle Corner Brackets */}
            <div className="absolute inset-6 pointer-events-none border-2 border-transparent">
              <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-emerald-400" />
              <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-emerald-400" />
              <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-emerald-400" />
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-emerald-400" />
            </div>
          </div>

          {/* Scan Error Banner */}
          {scanError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-xs text-red-900 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span className="font-medium">{scanError}</span>
              </div>
              <button
                type="button"
                onClick={() => setScanError(null)}
                className="text-red-400 hover:text-red-700 p-0.5 rounded cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Last Scanned Feedback Pill */}
          {lastScanned && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <div>
                  <span className="font-bold">{lastScanned.name}</span>
                  <span className="text-[11px] text-emerald-700 ml-1.5 font-mono">
                    [{lastScanned.barcode}]
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-emerald-600 font-mono">
                {lastScanned.time}
              </span>
            </div>
          )}

          {/* Manual Barcode Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleExecuteScan(manualCode);
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Enter 13-digit EAN barcode or SKU..."
                className="w-full px-3.5 py-2 text-xs font-mono border border-zinc-200 rounded-lg focus:outline-none focus:border-[#6D5AE6] bg-zinc-50 focus:bg-white"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-[#6D5AE6] hover:bg-[#5E4BD4] rounded-lg transition-colors cursor-pointer shrink-0"
            >
              Scan
            </button>
          </form>

          {/* Quick Supermarket Barcode Simulator / Fast-Tap List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                Instant Supermarket Barcode Test Tap
              </label>
              <span className="text-[10px] text-zinc-400">
                Click any item to simulate instant laser scan
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {products.slice(0, 10).map((prod) => (
                <button
                  key={prod.id}
                  onClick={() => handleExecuteScan(prod.barcode || prod.sku)}
                  className="flex items-center gap-2 p-2 border border-zinc-200 hover:border-[#6D5AE6] hover:bg-[#6D5AE6]/5 rounded-lg text-left transition-all cursor-pointer group"
                >
                  <img
                    src={prod.image || DEFAULT_PRODUCT_IMAGE}
                    alt={prod.name}
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                    }}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded object-cover bg-zinc-100 border border-zinc-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-zinc-900 group-hover:text-[#6D5AE6] truncate">
                      {prod.name}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      {prod.barcode}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between text-xs text-zinc-500 shrink-0">
          <span className="text-[11px]">
            Tip: Connect physical USB handheld scanner for auto-scan at register
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-medium text-zinc-700 hover:bg-zinc-200 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
