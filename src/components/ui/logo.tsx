"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

const APP_NAME = "SubstackSync";
const LOGO = "/logo.png";

export interface LogoProps {
  height?: number;
  width?: number;
  textClassName?: string;
  animate?: boolean;
  className?: string;
  withText?: boolean;
  includeByOrel?: boolean;
  onClick?: () => void;
}

export default function Logo({
  height,
  width,
  animate,
  className,
  textClassName,
  includeByOrel = false,
  withText = true,
  onClick,
}: LogoProps) {
  const dimensions = useMemo(() => {
    if (width && height) {
      return { width, height };
    }
    return { width: 32, height: 32 };
  }, [width, height]);

  const animation = animate
    ? {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
      }
    : {};

  return (
    <motion.div
      className={cn("flex flex-col gap-0.5", className)}
      {...animation}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <Image
          src={LOGO}
          alt={APP_NAME}
          width={width || 32}
          height={height || 32}
        />
        {withText && (
          <span
            className={cn(
              "text-base text-foreground font-semibold",
              textClassName
            )}
          >
            {APP_NAME}
          </span>
        )}
      </div>
      {includeByOrel && (
        <span
          className="text-xs text-muted-foreground"
          style={{
            marginLeft: dimensions.width + 8,
          }}
        >
          By Orel Zilberman
        </span>
      )}
    </motion.div>
  );
}
