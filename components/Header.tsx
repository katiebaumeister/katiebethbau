"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import flower7 from "../flowers/7.png";
import flower8 from "../flowers/8.png";
import flower9 from "../flowers/9.png";
import flower10 from "../flowers/10.png";
import flower12 from "../flowers/12.png";
import flower13 from "../flowers/13.png";
import flower14 from "../flowers/14.png";
import flower15 from "../flowers/15.png";

export default function Header() {
  const pathname = usePathname();
  const navItems = [
    { label: "Home", href: "/", icon: flower7 },
    { label: "Fabric Finder", href: "/finder", icon: flower8 },
    { label: "Color Profile", href: "/color-profile", icon: flower9 },
    { label: "KB's Fashions", href: "/garments", icon: flower10 },
    { label: "Digital Tailor", href: "/measurements", icon: flower12 },
    { label: "Bulletin Board", href: "/bulletin-board", icon: flower13 },
    { label: "Club Katie Beth", href: "/club-katie-beth", icon: flower14 },
    { label: "Shop", href: "/coming-soon", icon: flower15 },
  ];

  if (pathname !== "/") {
    return (
      <header className="absolute inset-x-0 top-0 z-50">
        <div className="px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center rounded-md border border-[var(--border)] bg-[var(--surface)]/90 px-3 py-1.5 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--foreground)]"
          >
            ← Back to Home
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="mx-auto grid max-w-7xl grid-cols-4 gap-x-2 gap-y-2 px-3 py-2 sm:grid-cols-8 sm:gap-x-3 sm:gap-y-2 sm:px-4 sm:py-3">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="group flex min-w-0 flex-col items-center text-center transition hover:opacity-95"
            aria-label={item.label}
          >
            <Image
              src={item.icon}
              alt=""
              className="h-[72px] w-[72px] object-contain sm:h-[82px] sm:w-[82px]"
            />
            <span className="mt-1 line-clamp-2 text-xs font-bold leading-tight text-[var(--foreground)] sm:text-sm">
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </header>
  );
}
