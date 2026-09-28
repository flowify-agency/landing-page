"use client";

import React, { useState, useEffect } from "react";

export default function LogoLoader({ variant = "2", size = "text-[28px] sm:text-[36px]", centered = true, fullPage = false }) {
  const [fontReady, setFontReady] = useState(false);
  const loaderClass = variant === "2" ? "loader-slate-white" : "loader-ghost-white";

  useEffect(() => {
    // Check if the font is already loaded
    if (document.fonts.check("900 16px 'GoogleSansFlex'")) {
      setFontReady(true);
      return;
    }
    // Otherwise wait for all fonts to finish loading
    document.fonts.ready.then(() => {
      setFontReady(true);
    });
  }, []);

  const content = fontReady ? (
    <span className={`${size} ${loaderClass}`}>
      Win & Spin
    </span>
  ) : null;

  if (fullPage) {
    return (
      <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-slate-950 select-none">
        {content}
      </div>
    );
  }

  if (centered) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] select-none">
        {content}
      </div>
    );
  }

  return content;
}
