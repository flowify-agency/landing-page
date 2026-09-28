"use client";

import React from "react";
import { Loader2, Check } from "lucide-react";

function renderIcon(Icon, className) {
  if (!Icon) return null;
  if (React.isValidElement(Icon)) {
    return React.cloneElement(Icon, {
      className: `${Icon.props.className || ""} ${className}`.trim(),
    });
  }
  const Component = Icon;
  return <Component className={className} />;
}

export const Button = React.forwardRef(function Button(
  {
    children,
    className = "",
    color = "primary",
    size = "md",
    isLoading = false,
    isSuccess = false,
    showTextWhileLoading = true,
    disabled = false,
    iconLeading: IconLeading,
    iconTrailing: IconTrailing,
    type = "button",
    ...props
  },
  ref
) {
  const isDisabled = disabled || isLoading || isSuccess;

  // Base sizing tokens
  const sizeClasses = {
    xs: "px-2.5 py-1.5 text-xs h-8 gap-1.5 rounded-lg",
    sm: "px-3 py-2 text-sm h-9 gap-2 rounded-xl",
    md: "px-4 py-2 text-sm h-10 gap-2 rounded-xl",
    lg: "px-4.5 py-2.5 text-base h-11 gap-2 rounded-xl",
    xl: "px-5 py-3 text-base h-12 gap-2.5 rounded-2xl",
    "2xl": "px-6 py-3.5 text-lg h-14 gap-3 rounded-2xl",
  }[size] || "px-4 py-2 text-sm h-10 gap-2 rounded-xl";

  // Color & Theme variants
  let colorClasses = {
    primary: "bg-[#00b05b] hover:bg-[#00964e] text-white shadow-sm shadow-emerald-500/20 active:scale-[0.99] border border-transparent",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 shadow-sm active:scale-[0.99]",
    tertiary: "bg-transparent hover:bg-slate-100 text-slate-600 border border-transparent",
    error: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm active:scale-[0.99] border border-transparent",
    slate: "bg-slate-900 hover:bg-slate-800 text-white shadow-sm active:scale-[0.99] border border-transparent",
  }[color] || "bg-[#00b05b] hover:bg-[#00964e] text-white shadow-sm";

  if (isSuccess) {
    colorClasses = "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 border border-transparent";
  }

  const iconSize = size === "xs" ? "w-3 h-3" : size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={`group relative inline-flex items-center justify-center font-bold transition-all duration-300 select-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${sizeClasses} ${colorClasses} ${className}`}
      {...props}
    >
      {/* Leading icon if present */}
      {IconLeading && !isLoading && !isSuccess && (
        <span className="shrink-0 transition-transform duration-200">
          {renderIcon(IconLeading, iconSize)}
        </span>
      )}

      {/* Button label */}
      <span className="transition-all duration-200">
        {children}
      </span>

      {/* Trailing Dynamic Status Icon (Arrow -> Loader -> Tick) */}
      <span className="relative flex items-center justify-center shrink-0 w-4 h-4 overflow-visible">
        {isSuccess ? (
          <span className="animate-icon-pop flex items-center justify-center w-4 h-4 rounded-full bg-white/20">
            <Check className={`${iconSize} stroke-[3.5] text-white`} />
          </span>
        ) : isLoading ? (
          <Loader2 className={`${iconSize} animate-spin text-white animate-spin-in`} />
        ) : IconTrailing ? (
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            {renderIcon(IconTrailing, iconSize)}
          </span>
        ) : null}
      </span>
    </button>
  );
});

Button.displayName = "Button";
export default Button;
