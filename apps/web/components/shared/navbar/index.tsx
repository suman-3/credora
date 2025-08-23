"use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import Image from "next/image";
import Logo from "../logo";

const menuItems = [
  { name: "_Hello", href: "#link" },
  { name: "Docs", href: "#link" },
  { name: "Connect", href: "#link" },
  { name: "Pricing", href: "#link" },
  { name: "Community", href: "#link" },
];

export const Navbar = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <header>
      {/* <nav
        data-state={menuState && "active"}
        className="fixed z-20 w-full px-2 mt-2"
      >
        <div
          className={cn(
            "mx-auto mt-2 max-w-7xl px-6 rounded-xl transition-all duration-300 lg:px-12",
            isScrolled && "max-w-4xl rounded-2xl lg:px-5 backdrop-blur-sm"
          )}
          style={{
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            background:
              "linear-gradient(94deg, rgba(17, 18, 20, 0.75) 4.87%, rgba(12, 13, 15, 0.90) 75.88%)",
            boxShadow: "0 1px 1px 1px rgba(255, 255, 255, 0.15) inset",
          }}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0">
            <div className="flex w-full justify-between lg:w-auto">
              <Logo />

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-text text-sm font-mono hover:text-white block duration-150"
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-text text-sm font-mono hover:text-white block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <Button
                  asChild
                  size="md"
                  variant="outline"
                  className={cn(isScrolled && "lg:hidden")}
                >
                  <Link href="#">
                    <span>Become An Organizer</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  size="md"
                  className={cn(isScrolled && "lg:hidden")}
                >
                  <Link href="#">
                    <span>Log In</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  size="md"
                  variant={"outline"}
                  className={cn(isScrolled ? "lg:inline-flex" : "hidden")}
                >
                  <Link href="#">
                    <span>Get Started</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav> */}
      <motion.nav
      className="fixed top-8 inset-x-0 bg-[#fff]/10 rounded-full h-14 z-50 w-[90%] 2xl:w-[1400px] mx-auto px-6 flex items-center"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.1
      }}
    >
      <Logo />
    </motion.nav>
    </header>
  );
};