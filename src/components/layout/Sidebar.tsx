import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Settings from "./Settings/Settings";

interface SidebarLink {
  title: string;
  href: string;
}

const links: SidebarLink[] = [
  {
    title: "Dashboard",
    href: "/",
  },
  {
    title: "Decks",
    href: "/decks",
  },
  {
    title: "Study",
    href: "/study",
  },
  {
    title: "Community",
    href: "/community",
  },
  {
    title: "Analysis",
    href: "/analysis",
  },
];

const SidebarButton = ({
  title,
  href,
}: {
  title: string;
  href: string | undefined;
}) => {
  const pathname = usePathname();
  const baseUrl = "/" + pathname.split("/")[1];

  const btn = (
    <button
      className={`text-left my-1 py-3 hover:px-5 active:px-5 rounded-lg font-bold block w-full transition-[background,padding,transform] active:scale-95 ${baseUrl == href ? "bg-menu hover:bg-primary-hover active:bg-primary-active text-menu-fg px-5" : "px-3 hover:bg-secondary active:bg-secondary-hover"}`}
    >
      {title}
    </button>
  );

  return href ? <Link href={href}>{btn}</Link> : btn;
};

const Sidebar = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <div className="relative min-w-60 max-w-60"></div>

      <div className="fixed min-w-60 max-w-60 h-full border-r-2 border-border ">
        <p className="font-extrabold text-xl h-14 px-5 py-3 border-b-2 border-border">
          Big Brain
        </p>

        <div className="p-3">
          {links.map((l, i) => (
            <SidebarButton title={l.title} href={l.href} key={i} />
          ))}
          <div className="absolute bottom-0 block w-full -ml-3 px-3 py-2">
            <button
              className={`my-1 py-3 rounded-lg font-bold block w-full border-2 transition active:scale-95 ${open ? "bg-secondary-active border-border-active" : "active:border-border-active border-border hover:bg-secondary hover:border-border-hover active:bg-secondary-active"}`}
              onClick={() => setOpen(true)}
            >
              Settings
            </button>
          </div>
        </div>
      </div>

      <Settings open={open} setOpen={setOpen} />
    </>
  );
};

export default Sidebar;
