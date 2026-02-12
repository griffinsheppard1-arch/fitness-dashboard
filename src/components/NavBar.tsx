"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/daily", label: "Daily", icon: "📅" },
  { href: "/weekly", label: "Weekly", icon: "📊" },
  { href: "/running", label: "Running", icon: "🏃" },
  { href: "/lifting", label: "Lifting", icon: "🏋️" },
  { href: "/nutrition", label: "Nutrition", icon: "🥗" },
  { href: "/race", label: "Race Prep", icon: "🏁" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link href="/" className="font-bold text-lg tracking-tight text-emerald-400 shrink-0">
          🏃 Fitness
        </Link>
        <div className="flex gap-0.5 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const isActive =
              pathname === tab.href ||
              (tab.href !== "/" && pathname?.startsWith(tab.href));
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                <span className="hidden sm:inline mr-1">{tab.icon}</span>
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
