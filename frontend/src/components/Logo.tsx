"use client";
import logoSrc from "@/imports/Normadic.png";

type Props = {
  accent?: string;
  size?: number;
  textSize?: number;
};

export function Logo({
  accent = "#F4B942",
  size = 26,
  textSize = 16,
}: Props) {
  return (
    <span
      className="flex items-center gap-2"
      style={{
        fontFamily: "'Clash Display', sans-serif",
        color: "white",
      }}
    >
      <img
        src={logoSrc.src}
        alt="Normadic Ventures"
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          filter: "drop-shadow(0 0 12px rgba(244,185,66,0.25))",
        }}
      />
      <span style={{ fontSize: textSize, letterSpacing: "0.25em" }}>
        NOMADIC
      </span>
      <span
        style={{ fontSize: textSize, letterSpacing: "0.25em", color: accent }}
      >
        VENTURES
      </span>
    </span>
  );
}
