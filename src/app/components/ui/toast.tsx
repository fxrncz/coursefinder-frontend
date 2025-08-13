"use client";

import React, { createContext, useContext, useCallback, useMemo, useState, useEffect, useRef } from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { localGeorama } from "../../fonts";
import { localGeorgia } from "../../fonts";
import { gsap } from "gsap";

type ToastVariant = "success" | "error" | "info";

type ShowToastOptions = {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
};

type ToastItem = Required<ShowToastOptions> & { id: number };

type ToastContextType = {
  showToast: (options: ShowToastOptions) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = (): ToastContextType => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((options: ShowToastOptions) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const toast: ToastItem = {
      id,
      title: options.title ?? "",
      description: options.description ?? "",
      variant: options.variant ?? "info",
      durationMs: options.durationMs ?? 3000,
    };
    setToasts(prev => [...prev, toast]);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast Container */}
      <div className="pointer-events-none fixed top-4 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-3">
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onClose={() => setToasts(prev => prev.filter(x => x.id !== t.id))} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastCard: React.FC<{ toast: ToastItem; onClose: () => void }> = ({ toast, onClose }) => {
  const { variant, title, description } = toast;
  const elRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (elRef.current) {
      gsap.fromTo(
        elRef.current,
        { y: -40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out" }
      );
    }
    timerRef.current = window.setTimeout(() => {
      if (elRef.current) {
        gsap.to(elRef.current, {
          y: -40,
          autoAlpha: 0,
          duration: 0.35,
          ease: "power2.in",
          onComplete: onClose,
        });
      } else {
        onClose();
      }
    }, toast.durationMs);
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [onClose, toast.durationMs]);

  const accentClass = variant === "success"
    ? "bg-green-500"
    : variant === "error"
    ? "bg-red-500"
    : "bg-[#A75F00]"; // brand color

  const icon = variant === "success" ? (
    <CheckCircle2 className="h-5 w-5 text-green-600" />
  ) : variant === "error" ? (
    <XCircle className="h-5 w-5 text-red-600" />
  ) : (
    <Info className="h-5 w-5 text-[#A75F00]" />
  );

  const handleManualClose = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    if (elRef.current) {
      gsap.to(elRef.current, {
        y: -40,
        autoAlpha: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  };

  return (
    <div
      ref={elRef}
      className="pointer-events-auto relative flex min-w-[260px] max-w-[360px] items-start gap-3 rounded-md border border-gray-200 bg-white px-4 py-3 shadow-lg hover:shadow-xl"
      style={{ willChange: "transform, opacity" }}
    >
      <div className={`absolute left-0 top-0 h-full w-1 ${accentClass}`} />
      <div className="mt-[2px] flex-shrink-0">{icon}</div>
      <div className="flex-1">
        {title && (
          <div className={`${localGeorama.className} text-sm font-semibold text-[#353535]`}>{title}</div>
        )}
        {description && (
          <div className={`${localGeorgia.className} text-sm text-[#353535]/80`}>{description}</div>
        )}
      </div>
      <button
        className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded hover:bg-gray-100"
        onClick={handleManualClose}
        aria-label="Close notification"
      >
        <X className="h-4 w-4 text-gray-500" />
      </button>
    </div>
  );
};

export default ToastProvider;


