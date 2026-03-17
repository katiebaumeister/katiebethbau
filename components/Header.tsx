"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="relative flex w-full items-center justify-between px-4 py-5 sm:px-6">
        {/* Menu button (left) */}
        <div className="flex w-10 flex-shrink-0 items-center justify-start" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex size-10 items-center justify-center rounded-md text-[var(--foreground)] hover:bg-[var(--border)]/50 transition"
            aria-expanded={menuOpen}
            aria-haspopup="true"
            aria-label="Open menu"
          >
            <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {menuOpen && (
            <div
              className="absolute left-6 top-full z-50 mt-1 min-w-[180px] rounded-md border border-[var(--border)] bg-[var(--surface)] py-2 shadow-lg"
              role="menu"
            >
              <Link
                href="/finder"
                className="block px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--border)]/50 transition"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
              >
                Find fabric
              </Link>
              <Link
                href="/color-profile"
                className="block px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--border)]/50 transition"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
              >
                Color profile
              </Link>
            </div>
          )}
        </div>

        {/* Centered logo */}
        <div className="absolute left-1/2 flex -translate-x-1/2 translate-y-2 items-center justify-center">
          <Link href="/" className="block h-24 w-64 overflow-hidden">
            <Image
              src="/KB.png"
              alt="Katie Beth"
              width={220}
              height={72}
              className="h-full w-full scale-[3.5] object-contain"
              priority
            />
          </Link>
        </div>

        {/* Shopping cart (right) */}
        <div className="flex w-10 flex-shrink-0 items-center justify-end">
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-md text-[var(--foreground)] hover:bg-[var(--border)]/50 transition"
            aria-label="Shopping cart"
          >
            <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
