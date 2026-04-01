"use client";

import { useState } from "react";
import Link from "next/link";

interface AIBannerAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface AIBannerProps {
  hint?: string;
  defaultHint?: string;
  actions?: AIBannerAction[];
  defaultActions?: AIBannerAction[];
}

export default function AIBanner({ hint, defaultHint, actions, defaultActions }: AIBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  const displayHint = hint || defaultHint;
  const displayActions = actions ?? defaultActions;

  if (!displayHint || dismissed) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-5 flex items-start gap-3">
      <span className="text-base shrink-0 mt-0.5">💡</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-blue-900 leading-relaxed">{displayHint}</p>
        {displayActions && displayActions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {displayActions.map((a, i) =>
              a.href ? (
                <Link
                  key={i}
                  href={a.href}
                  className="text-xs bg-blue-600 text-white rounded-lg px-3 py-1.5 hover:bg-blue-700 transition-colors"
                >
                  {a.label}
                </Link>
              ) : (
                <button
                  key={i}
                  onClick={a.onClick}
                  className="text-xs bg-blue-600 text-white rounded-lg px-3 py-1.5 hover:bg-blue-700 transition-colors"
                >
                  {a.label}
                </button>
              )
            )}
          </div>
        )}
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-blue-400 hover:text-blue-600 text-lg leading-none shrink-0 mt-0.5"
        aria-label="关闭"
      >
        ×
      </button>
    </div>
  );
}
