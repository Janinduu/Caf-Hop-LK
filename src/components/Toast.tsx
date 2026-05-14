"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { Undo2, X } from "lucide-react";

export interface ToastData {
  id: number;
  message: string;
  icon?: React.ReactNode;
  undo?: () => void;
}

interface Props {
  toast: ToastData | null;
  onDismiss: () => void;
}

export function Toast({ toast, onDismiss }: Props) {
  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(onDismiss, 5000);
    return () => window.clearTimeout(id);
  }, [toast, onDismiss]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] pointer-events-none flex justify-center pb-6 px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            className="pointer-events-auto glass-strong rounded-full pl-4 pr-2 py-2 flex items-center gap-3 shadow-lg"
          >
            {toast.icon && (
              <span className="flex items-center text-base">{toast.icon}</span>
            )}
            <span className="text-sm text-foreground font-medium">
              {toast.message}
            </span>
            {toast.undo && (
              <button
                type="button"
                onClick={() => {
                  toast.undo?.();
                  onDismiss();
                }}
                className="inline-flex items-center gap-1 rounded-full bg-foreground text-background px-3 py-1 text-xs font-semibold hover:bg-primary transition-colors"
              >
                <Undo2 size={12} strokeWidth={2.25} />
                Undo
              </button>
            )}
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss"
              className="w-7 h-7 rounded-full text-muted hover:text-foreground hover:bg-foreground/8 flex items-center justify-center transition-colors"
            >
              <X size={14} strokeWidth={2} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
