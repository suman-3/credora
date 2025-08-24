"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import React from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import Logo from "./logo";
import { motion } from "framer-motion";

const menuItems = [
  { name: "_Hello", href: `${process.env.NEXT_PUBLIC_CONSOLE_URL}/auth/login` },
  { name: "Docs", href: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs` },
  { name: "Features", href: "#features" },
  { name: "Testimonials", href: "#testimonials" },
];

export const Navbar = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  const authPageUrl = `${process.env.NEXT_PUBLIC_CONSOLE_URL}/auth/login`;
  const organizerPageUrl = `${process.env.NEXT_PUBLIC_CONSOLE_URL}/dashboard/issuer`;
  const docsPageUrl = `${process.env.NEXT_PUBLIC_DOCS_URL}/docs`;

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll handler for hash links
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Only handle hash links (internal page sections)
    if (href.startsWith('#')) {
      e.preventDefault();
      
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Close mobile menu if open
        setMenuState(false);
        
        // Calculate offset to account for fixed navbar
        const navbarHeight = 80; // Adjust this based on your navbar height
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Update URL hash after scroll completes
        setTimeout(() => {
          history.pushState(null, '', href);
        }, 100);
      }
    }
  };

  // Enhanced Link component that handles smooth scrolling
  const SmoothLink = ({ 
    href, 
    children, 
    className,
    ...props 
  }: { 
    href: string; 
    children: React.ReactNode; 
    className?: string;
    [key: string]: any;
  }) => {
    const isHashLink = href.startsWith('#');
    
    if (isHashLink) {
      return (
        <a
          href={href}
          onClick={(e) => handleSmoothScroll(e, href)}
          className={className}
          {...props}
        >
          {children}
        </a>
      );
    }
    
    // Use Next.js Link for external/internal page navigation
    return (
      <Link href={href} className={className} {...props}>
        {children}
      </Link>
    );
  };

  React.useEffect(() => {
    // Add CSS for smooth scrolling as fallback
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Handle initial page load with hash
    if (window.location.hash) {
      setTimeout(() => {
        const targetElement = document.getElementById(window.location.hash.substring(1));
        if (targetElement) {
          const navbarHeight = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 500); // Delay to ensure page is fully loaded
    }

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <header>
      <motion.nav
        data-state={menuState ? "active" : "inactive"}
        className="fixed inset-x-0 top-0 z-50 w-full px-2"
        aria-label="Main Navigation"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 0.1,
        }}
      >
        <div
          className={cn(
            // Base (not scrolled)
            "mx-auto mt-2 rounded-2xl border-light/30 max-w-6xl px-6 transition-all duration-300 ease-out will-change-transform lg:px-12",
            // Scrolled state: shrink width, add glass/blur, rounded frame, border and tighter padding
            isScrolled &&
              "max-w-4xl rounded-2xl border border-light/20 bg-dark/60 backdrop-blur-lg lg:px-5"
          )}
        >
          <div
            className={cn(
              "relative flex flex-wrap items-center justify-between gap-6 py-3 transition-[padding,margin] duration-300 lg:gap-0 lg:py-4",
              // Slightly reduce vertical padding when scrolled for a "shrink" effect
              isScrolled && "py-2 lg:py-3"
            )}
          >
            {/* Left: Logo + Mobile Toggle */}
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <Logo />
              </Link>

              <button
                onClick={() => setMenuState((s) => !s)}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                {/* Crossfade icons based on data-state via Tailwind arbitrary variants */}
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 transform duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 transform duration-200" />
              </button>
            </div>

            {/* Center: Desktop Menu */}
            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <SmoothLink
                      href={item.href}
                      className="block text-white lowercase font-semibold tracking-wide font-clash text-[16px] transition-colors duration-150 hover:text-light/70"
                    >
                      <span>{item.name}</span>
                    </SmoothLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Actions + Mobile Panel */}
            <div
              className={cn(
                // Mobile panel (hidden by default)
                "bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent",
                // Animate panel slide/fade on open for mobile
                menuState
                  ? "animate-in fade-in-0 slide-in-from-top-3 duration-200"
                  : "animate-out fade-out-0 slide-out-to-top-3 duration-150"
              )}
            >
              {/* Mobile menu list */}
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <SmoothLink
                        href={item.href}
                        className="block text-white font-semibold tracking-wide font-clash text-sm transition-colors duration-150 hover:text-white"
                      >
                        <span>{item.name}</span>
                      </SmoothLink>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA buttons */}
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <Button
                  asChild
                  size="md"
                  variant="outline"
                  // Hide these on large when scrolled, to only show the single "Get Started"
                  className={cn(isScrolled && "lg:hidden")}
                >
                  <Link href={organizerPageUrl}>
                    <span>Become An Issuer</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  size="md"
                  className={cn(isScrolled && "lg:hidden")}
                >
                  <Link href={authPageUrl}>
                    <span>Log In</span>
                  </Link>
                </Button>

                {/* When scrolled, show just one CTA on large screens */}
                <Button
                  asChild
                  size="md"
                  variant="outline"
                  className={cn(isScrolled ? "lg:inline-flex" : "hidden")}
                >
                  <Link href={authPageUrl}>
                    <span>Get Started</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>
    </header>
  );
};