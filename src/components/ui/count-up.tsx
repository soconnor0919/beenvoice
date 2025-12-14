"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

export function CountUp({ value, prefix = "", suffix = "" }: { value: number, prefix?: string, suffix?: string }) {
    const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
    const display = useTransform(spring, (current) => `${prefix}${current.toFixed(2)}${suffix}`);

    useEffect(() => {
        spring.set(value);
    }, [spring, value]);

    return <motion.span>{display}</motion.span>;
}
