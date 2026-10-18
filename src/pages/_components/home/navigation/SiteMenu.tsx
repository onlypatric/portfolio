import { useEffect, useRef, useState } from "react";
import { ArrowUpRightIcon, CaretDownIcon } from "@phosphor-icons/react";
import { Link } from "@heroui/react";

export default function SiteMenu() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className="sticky top-4 z-50 h-0 px-4">
      <div className="relative z-10 mx-auto flex w-full max-w-xl items-center justify-between rounded-[calc(var(--radius)*2)] p-2 backdrop-blur-md backdrop-saturate-50">
        <img
          src="/index/LOGO.svg"
          alt="Patric's logo"
          width="40"
          height="40"
          className="pl-1 pt-1 brightness-0 invert"
        />
        <button
          ref={buttonRef}
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((current) => !current)}
          className="grid size-10 cursor-pointer place-items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
        >
          <CaretDownIcon size={20} className="site-menu-caret" data-open={open} />
        </button>
      </div>

      <div aria-hidden="true" data-open={open} className="site-menu-backdrop fixed inset-0 z-0" />

      <nav
        id="site-menu"
        aria-label="Main menu"
        aria-hidden={!open}
        inert={!open}
        data-open={open}
        className="site-menu-panel fixed inset-0 z-0 flex items-center justify-center bg-blue-400 text-accent-foreground"
      >
        <div className="site-menu-content flex flex-col items-center gap-6 text-3xl sm:text-5xl">
          <Link
            href="#home"
            onClick={() => setOpen(false)}
            className="group flex items-center gap-3 font-sans text-inherit uppercase font-bold"
          >
            Home
            <Link.Icon className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
              <ArrowUpRightIcon aria-hidden="true" weight="bold" />
            </Link.Icon>
          </Link>
          <Link
            href="#current"
            onClick={() => setOpen(false)}
            className="group flex items-center gap-3 font-sans text-inherit uppercase font-bold"
          >
            What I'm up to
            <Link.Icon className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
              <ArrowUpRightIcon aria-hidden="true" weight="bold" />
            </Link.Icon>
          </Link>
        </div>
      </nav>
    </div>
  );
}
