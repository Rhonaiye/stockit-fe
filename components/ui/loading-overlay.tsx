
"use client";

import { useApp } from "@/context/app-context";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function LoadingOverlay() {
    const { loading } = useApp();
    const pathname = usePathname();

    // Hide loader on dashboard overview page
    if (pathname === '/dashboard') return null;

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="loader-overlay"
                >
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="loader"
                    ></motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
