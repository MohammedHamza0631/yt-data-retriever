"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface CardBorderProps {
    children: React.ReactNode;
    className?: string;
}

export function CardBorder({ children, className = "" }: CardBorderProps) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        const updatePosition = (e: MouseEvent) => {
            if (!card) return;
            const rect = card.getBoundingClientRect();

            // Calculate relative position
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate distances to each edge
            const distToLeft = x;
            const distToRight = rect.width - x;
            const distToTop = y;
            const distToBottom = rect.height - y;

            // Find the minimum distance
            const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);

            // Set opacity based on how close we are to any edge
            const maxDist = 100; // Maximum distance to show effect
            const opacity = 1 - Math.min(minDist / maxDist, 1);

            setPosition({ x, y });
            setOpacity(opacity);
        };

        const handleMouseEnter = () => {
            card.addEventListener("mousemove", updatePosition);
        };

        const handleMouseLeave = () => {
            card.removeEventListener("mousemove", updatePosition);
            setOpacity(0);
        };

        card.addEventListener("mouseenter", handleMouseEnter);
        card.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            card.removeEventListener("mouseenter", handleMouseEnter);
            card.removeEventListener("mouseleave", handleMouseLeave);
            card.removeEventListener("mousemove", updatePosition);
        };
    }, []);

    return (
        <div ref={cardRef} className={`relative ${className}`}>
            <motion.div
                className="absolute inset-0 rounded-lg pointer-events-none"
                animate={{
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,0,0,${opacity * 0.1}), transparent 40%)`,
                    border: `1px solid rgba(255,0,0,${opacity * 0.2})`,
                }}
                transition={{ type: "spring", bounce: 0, duration: 0.1 }}
            />
            <div className="relative">{children}</div>
        </div>
    );
}