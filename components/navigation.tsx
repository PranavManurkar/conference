"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [openSub, setOpenSub] = useState<Record<string, boolean>>({});
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Invited Speakers", href: "/invited_speaker" },
    {
      label: "Sponsorship",
      href: "/",
      children: [
        { label: "Sponsorship Opportunities", href: "/sponsorship" },
        { label: "Our Sponsors", href: "/sponsors" },
        
      ],
    },
    {
      label: "Registration/Accommodation",
      href: "/",
      children: [
        { label: "Registration", href: "/registration" },
        { label: "Paper Submission", href: "/paper-submission" },
        { label: "Accommodation", href: "/accommodation" },
      ],
    },
    { label: "Important Dates", href: "/important-dates" },
    { label: "Schedule", href: "/schedule" },
    { label: "Committee", href: "/committee" },
  ];

  const isActive = (href: string) => pathname === href;

  const toggleSub = (label: string) => {
    setOpenSub((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <nav className="sticky top-0 z-50">
      <div className="bg-[color:var(--primary-foreground)] shadow-lg">
        <div className="w-full px-6 lg:px-12">
          <div className="flex justify-between items-center h-24">
            {/* Left: IIT Indore Logo and Name */}
            <Link
              href="/"
              className="flex items-center space-x-3  transition-opacity"
            >
              <div className="w-16 h-16 relative flex-shrink-0">
                <Image
                  src="/new_logo.png"
                  alt="IIT Indore Logo"
                  width={94}
                  height={94}
                  className="object-contain mt-2 pt-2"
                />
              </div>
              <div className="hidden sm:flex flex-col  hover:opacity-80 justify-center">
                <h2 className="text-[color:var(--nav)] font-bold text-sm leading-tight">
                  भारतीय प्रौद्योगिकी संस्थान
                </h2>
                <p className="text-[color:var(--nav)] font-semibold text-xs">
                  Indian Institute of Technology
                </p>
                <p className="text-[color:var(--nav)] font-semibold text-xs">Indore</p>
              </div>
            </Link>

            <div className="flex-1"></div>

            {/* Right: 2D MatTechGlobal Branding */}
            <div className="hidden lg:flex flex-col items-end justify-center space-y-1">
                <div className="w-28 h-28 relative mb-2 -mr-4">
                <Image
                  src="/mtg2.png"
                  alt="2D MatTechGlobal Logo"
                  width={120}
                  height={120}
                  className="object-contain  "
                />
                </div>
              {/* <p className="text-[color:var(--nav)] text-xs -mt-1">June 24-26, 2026</p> */}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden ml-4">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg  text-[color:var(--offwhite)] hover:bg-[color:var(--navhover)] transition-colors duration-200"
                aria-label="Toggle navigation"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[color:var(--nav)] shadow-3xl ">
        <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center">
            <div className="hidden lg:flex items-center flex-wrap justify-start flex-1">
              {navItems.map((item) => (
                <div key={item.label} className="relative group flex-shrink-0">
                  {/* If item has children, render non-navigating button for parent */}
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        onClick={(e) => e.preventDefault()}
                        aria-expanded={!!openSub[item.label]}
                        className={`px-3 py-4 text-sm font-semibold transition-all duration-300 border-b-4 whitespace-nowrap text-center block ${
                          // If any child is active, show active style
                          item.children.some((c) => isActive(c.href))
                            ? "text-white border-b-[color:var(--primary)] bg-[color:var(--navhover)]"
                            : "text-white border-b-transparent hover:text-white hover:border-b-[color:var(--primary)] hover:bg-[color:var(--navhover)]"
                        }`}
                      >
                        {item.label}
                      </button>

                      {/* Desktop dropdown (hover) */}
                      <div className="absolute left-0 top-full mt-0 hidden group-hover:block bg-[color:var(--navhover)]/95 shadow-lg z-50 min-w-max border-t-2 border-[color:var(--primary)]">
                        {item.children.map((c) => (
                          <Link
                            key={c.label}
                            href={c.href}
                            className={`block px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all duration-300 border-l-4 ${
                              isActive(c.href)
                                ? "text-white border-l-[color:var(--primary)] bg-[color:var(--nav)]"
                                : "text-white border-l-transparent hover:text-white hover:border-l-[color:var(--primary)] hover:bg-[color:var(--nav)]"
                            }`}
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`px-3 py-4 text-sm font-semibold transition-all duration-300 border-b-4 whitespace-nowrap text-center block ${
                        isActive(item.href)
                          ? "text-white border-b-[color:var(--primary)] bg-[color:var(--navhover)]"
                          : "text-white border-b-transparent hover:text-white hover:border-b-[color:var(--primary)] hover:bg-[color:var(--navhover)]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <div className="hidden lg:flex flex-shrink-0">
              <Link
                href="/registration"
                className="px-6 py-2.5 bg-[color:var(--primary)] hover:opacity-90 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Register
              </Link>
            </div>
          </div>

          {isOpen && (
            <div className="lg:hidden pb-4 space-y-2 animate-in fade-in slide-in-from-top-4 mt-2">
              {navItems.map((item) => (
                <div key={item.label}>
                  {/* Parent item: if has children, render a toggle button, otherwise a Link */}
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        onClick={() => toggleSub(item.label)}
                        className={`w-full text-left px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200 ${
                          item.children.some((c) => isActive(c.href))
                            ? "bg-[color:var(--primary)] text-white"
                            : "text-white hover:bg-[color:var(--navhover)] hover:text-white"
                        }`}
                        aria-expanded={!!openSub[item.label]}
                      >
                        {item.label}
                      </button>

                      {openSub[item.label] && (
                        <div className="pl-6 mt-2 space-y-1">
                          {item.children.map((c) => (
                            <Link
                              key={c.label}
                              href={c.href}
                              className={`block px-4 py-2 rounded-lg text-base font-medium transition-all duration-150 ${
                                isActive(c.href)
                                  ? "bg-[color:var(--primary)] text-[color:var(--offwhite)]"
                                  : "text-white hover:bg-[color:var(--navhover)] hover:text-white"
                              }`}
                              onClick={() => setIsOpen(false)}
                            >
                              {c.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`block px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200 ${
                        isActive(item.href)
                          ? "bg-[color:var(--primary)] text-white"
                          : "text-white hover:bg-[color:var(--navhover)] hover:text-white"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
