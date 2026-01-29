import React from "react";
import { AlertCircle, CheckCircle, Info, AlertTriangle, Lightbulb } from "lucide-react";

/**
 * Callout Component
 * Highlighted info boxes for important notes
 * 
 * Usage in markdown: 
 * <!-- callout:info:This is important information -->
 * <!-- callout:success:Trade executed successfully -->
 * <!-- callout:warning:Be careful with leverage -->
 * <!-- callout:tip:Pro tip here -->
 */

const CALLOUT_STYLES = {
  info: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    icon: Info,
    iconColor: "text-blue-400",
    title: "Info"
  },
  success: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    icon: CheckCircle,
    iconColor: "text-emerald-400",
    title: "Success"
  },
  warning: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    icon: AlertTriangle,
    iconColor: "text-amber-400",
    title: "Warning"
  },
  error: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    icon: AlertCircle,
    iconColor: "text-red-400",
    title: "Error"
  },
  tip: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    icon: Lightbulb,
    iconColor: "text-purple-400",
    title: "Pro Tip"
  }
};

export default function Callout({ type = "info", title, children }) {
  const style = CALLOUT_STYLES[type] || CALLOUT_STYLES.info;
  const Icon = style.icon;
  const displayTitle = title || style.title;

  return (
    <div className={`my-6 rounded-xl border ${style.border} ${style.bg} p-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${style.iconColor}`} />
        <div className="flex-1">
          <div className={`font-semibold text-sm ${style.iconColor} mb-1`}>
            {displayTitle}
          </div>
          <div className="text-zinc-300 text-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
