import React, { Dispatch, SetStateAction, useState } from "react";

import Appearance from "./Appearance";
import Backups from "./Backups";
import About from "./About";
import { Button } from "@components";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const Settings = ({ open, setOpen }: Props) => {
  type Tabs = "appearance" | "backups" | "about";
  const [tab, setTab] = useState<Tabs>("appearance");

  return (
    <>
      <div
        className={`z-50 bg-black/40 backdrop-blur-md fixed top-0 left-0 h-full w-full transition-[opacity,visibility] duration-300 ${!open && "invisible opacity-0"}`}
        onClick={() => setOpen(false)}
      ></div>

      <div
        className={`z-50 h-full max-h-96 fixed w-full max-w-xl bg-bg-modal rounded-lg top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 transition-[visibility,opacity,transform,background] duration-300 ${!open && "invisible opacity-0 scale-75"}`}
      >
        <div className="h-14"></div>
        <div className="fixed top-0 left-0 right-0 h-14 w-full border-b-2 p-2 border-border">
          {["appearance", "backups", "about"].map((t, i) => (
            <Button
              key={i}
              variant={tab == t ? "menu-active" : "menu"}
              size="sm"
              label={t.charAt(0).toUpperCase() + t.slice(1)}
              onClick={() => setTab(t as Tabs)}
              className="mx-0.5"
            />
          ))}
        </div>

        <div className="absolute top-14 bottom-0 w-full p-5 overflow-y-auto">
          {tab == "appearance" ? (
            <Appearance />
          ) : tab == "backups" ? (
            <Backups />
          ) : (
            <About />
          )}
        </div>
      </div>
    </>
  );
};

export default Settings;
