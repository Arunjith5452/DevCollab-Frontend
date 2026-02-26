"use client";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmModalProps {
    open: boolean;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({
    open,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    type = 'confirm'
}: ConfirmModalProps & { type?: 'confirm' | 'alert' }) {

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Background Overlay */}
                    <motion.div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[90]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                    />

                    {/* Modal Card */}
                    <motion.div
                        className="fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-xl shadow-xl p-6 z-[100]"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                    >
                        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                        <p className="text-sm text-gray-600 mt-2">{message}</p>

                        <div className="mt-6 flex justify-end gap-3">
                            {type === 'confirm' && (
                                <button
                                    onClick={onCancel}
                                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-100 transition"
                                >
                                    {cancelText}
                                </button>
                            )}

                            <button
                                onClick={onConfirm}
                                className={`px-4 py-2 rounded-lg text-white text-sm transition ${type === 'alert' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'}`}
                            >
                                {type === 'alert' && confirmText === "Confirm" ? "OK" : confirmText}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
