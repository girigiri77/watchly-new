"use client"

import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect } from "react"

interface AdminModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  maxWidth?: string // e.g. "max-w-4xl"
}

export default function AdminModal({ isOpen, onClose, title, children, maxWidth = "max-w-4xl" }: AdminModalProps) {
  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#111827]/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: "spring", stiffness: 360, damping: 32 }}
            className={`relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[24px] border border-white/10 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] sm:max-h-[90vh] sm:rounded-[24px] ${maxWidth}`}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
              <h2 className="truncate pr-2 text-lg font-bold tracking-tight text-[#111827] sm:text-xl">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-[#6B7280] transition-all hover:bg-gray-100 hover:text-[#111827]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar sm:p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
