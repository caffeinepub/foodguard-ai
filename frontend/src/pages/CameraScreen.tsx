import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { X, Camera, RotateCcw, Leaf, ScanLine, AlertCircle } from 'lucide-react';

type ScanMode = 'food' | 'ingredient';

export function CameraScreen() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<ScanMode>('food');
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [captured, setCaptured] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setIsSupported(false);
        setIsLoading(false);
        return;
      }
      setIsSupported(true);
      await stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsActive(true);
    } catch (err: unknown) {
      const e = err as { name?: string; message?: string };
      if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
        setErrorMsg('Camera permission denied. Please allow camera access and try again.');
      } else if (e.name === 'NotFoundError' || e.name === 'DevicesNotFoundError') {
        setErrorMsg('No camera found on this device.');
      } else {
        setErrorMsg('Could not start camera. Please try again.');
      }
      setIsActive(false);
    } finally {
      setIsLoading(false);
    }
  }, [stopCamera]);

  // Auto-start camera on mount
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const capturePhoto = useCallback(async (): Promise<File | null> => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(new File([blob], 'capture.jpg', { type: 'image/jpeg' }));
        } else {
          resolve(null);
        }
      }, 'image/jpeg', 0.85);
    });
  }, []);

  const handleCapture = async () => {
    const photo = await capturePhoto();
    if (photo) {
      setCaptured(true);
      await stopCamera();
      if (mode === 'food') {
        navigate({ to: '/food-input' });
      } else {
        navigate({ to: '/ingredient-scan' });
      }
    }
  };

  const handleCancel = async () => {
    await stopCamera();
    navigate({ to: '/home' });
  };

  return (
    <div className="app-container flex flex-col min-h-screen bg-black screen-enter">
      {/* Top bar */}
      <div
        className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-10 pb-4"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)' }}
      >
        <button
          onClick={handleCancel}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
          aria-label="Cancel"
        >
          <X className="w-5 h-5 text-white" />
        </button>
        <span className="text-white font-bold text-base">
          {mode === 'food' ? 'Scan Food' : 'Scan Label'}
        </span>
        <div className="w-10" />
      </div>

      {/* Mode toggle */}
      <div className="absolute top-20 left-0 right-0 z-20 flex justify-center px-4">
        <div
          className="flex rounded-full p-1 gap-1"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
        >
          <button
            onClick={() => setMode('food')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              mode === 'food' ? 'text-white' : 'text-white/60'
            }`}
            style={mode === 'food' ? { background: 'oklch(0.38 0.12 155)' } : {}}
          >
            <ScanLine className="w-3.5 h-3.5" />
            Food Item
          </button>
          <button
            onClick={() => setMode('ingredient')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              mode === 'ingredient' ? 'text-white' : 'text-white/60'
            }`}
            style={mode === 'ingredient' ? { background: 'oklch(0.38 0.12 155)' } : {}}
          >
            <Leaf className="w-3.5 h-3.5" />
            Label
          </button>
        </div>
      </div>

      {/* Camera preview area */}
      <div
        className="relative flex-1 flex items-center justify-center"
        style={{ minHeight: '100vh' }}
      >
        {isSupported === false ? (
          <div className="flex flex-col items-center gap-4 px-8 text-center">
            <Camera className="w-16 h-16 text-white/40" />
            <p className="text-white font-semibold text-lg">Camera Not Supported</p>
            <p className="text-white/60 text-sm">
              Your browser doesn't support camera access.
            </p>
            <button
              onClick={handleCancel}
              className="mt-2 px-6 py-3 rounded-full text-white font-semibold"
              style={{ background: 'oklch(0.38 0.12 155)' }}
            >
              Go Back
            </button>
          </div>
        ) : (
          <>
            {/* Video element — always rendered so ref is available */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Inactive state */}
            {!isActive && !isLoading && !errorMsg && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
                >
                  <Camera className="w-10 h-10 text-white/60" />
                </div>
                <p className="text-white/70 text-sm font-medium">Camera inactive</p>
                <button
                  onClick={startCamera}
                  className="px-6 py-3 rounded-full text-white font-semibold"
                  style={{ background: 'oklch(0.38 0.12 155)' }}
                >
                  Start Camera
                </button>
              </div>
            )}

            {/* Loading state */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  <p className="text-white/70 text-sm">Starting camera…</p>
                </div>
              </div>
            )}

            {/* Viewfinder frame */}
            {isActive && (
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div
                  className="relative"
                  style={{
                    width: mode === 'food' ? '260px' : '300px',
                    height: mode === 'food' ? '260px' : '180px',
                  }}
                >
                  {/* Corner brackets */}
                  {[
                    'top-0 left-0 border-t-2 border-l-2 rounded-tl-xl',
                    'top-0 right-0 border-t-2 border-r-2 rounded-tr-xl',
                    'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-xl',
                    'bottom-0 right-0 border-b-2 border-r-2 rounded-br-xl',
                  ].map((cls, i) => (
                    <div
                      key={i}
                      className={`absolute w-8 h-8 ${cls}`}
                      style={{ borderColor: 'oklch(0.72 0.18 145)' }}
                    />
                  ))}
                  {/* Scan line animation */}
                  <div
                    className="absolute left-2 right-2 h-0.5 rounded-full"
                    style={{
                      background: 'oklch(0.72 0.18 145)',
                      top: '50%',
                      animation: 'scanLine 2s ease-in-out infinite',
                      boxShadow: '0 0 8px oklch(0.72 0.18 145)',
                    }}
                  />
                </div>
                <p className="absolute bottom-32 text-white/80 text-sm font-medium text-center px-8">
                  {mode === 'food'
                    ? 'Position food item within the frame'
                    : 'Position ingredient label within the frame'}
                </p>
              </div>
            )}

            {/* Error display */}
            {errorMsg && (
              <div
                className="absolute top-32 left-4 right-4 z-20 rounded-xl px-4 py-3 flex items-center gap-2"
                style={{ background: 'rgba(239,68,68,0.9)', backdropFilter: 'blur(8px)' }}
              >
                <AlertCircle className="w-4 h-4 text-white flex-shrink-0" />
                <p className="text-white text-sm font-medium flex-1">{errorMsg}</p>
                <button
                  onClick={startCamera}
                  className="ml-auto text-white/80 text-xs underline flex-shrink-0"
                >
                  Retry
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom controls */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-8 pb-10 pt-6"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}
      >
        <button
          onClick={handleCancel}
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: '1.5px solid rgba(255,255,255,0.3)',
          }}
          aria-label="Cancel"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Capture button */}
        <button
          onClick={handleCapture}
          disabled={!isActive || isLoading || captured}
          className="w-20 h-20 rounded-full flex items-center justify-center transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: isActive ? 'oklch(0.99 0 0)' : 'rgba(255,255,255,0.3)',
            boxShadow: isActive ? '0 0 0 4px rgba(255,255,255,0.3)' : 'none',
          }}
          aria-label="Capture photo"
        >
          <div
            className="w-14 h-14 rounded-full"
            style={{
              background: isActive ? 'oklch(0.38 0.12 155)' : 'rgba(255,255,255,0.5)',
            }}
          />
        </button>

        <button
          onClick={startCamera}
          disabled={isLoading}
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: '1.5px solid rgba(255,255,255,0.3)',
          }}
          aria-label="Restart camera"
        >
          <RotateCcw className="w-5 h-5 text-white" />
        </button>
      </div>

      <style>{`
        @keyframes scanLine {
          0%, 100% { top: 10%; }
          50% { top: 90%; }
        }
      `}</style>
    </div>
  );
}
