import Link from "next/link";
import React, { Dispatch, SetStateAction, useState } from "react";
import Appearance from "./Appearance";
import Backups from "./Backups";
import About from "./About";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const Settings = ({ open, setOpen }: Props) => {
  type Tabs = "appearance" | "backups" | "about";
  let [tab, setTab] = useState<Tabs>("appearance");

  return (
    <>
      <div
        className={`z-50 bg-black/20 fixed top-0 left-0 h-full w-full transition-[opacity,visibility] duration-300 ${!open && "invisible opacity-0"}`}
        onClick={() => setOpen(false)}
      ></div>
      <div
        className={`z-50 h-full max-h-96 overflow-y-auto fixed w-full max-w-xl bg-white rounded-lg top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 transition-[visibility,opacity,transform] duration-300 ${!open && "invisible opacity-0 scale-75"}`}
      >
        <div className="h-14 border-b-2 border-gray-200">
          {["appearance", "backups", "about"].map((t, i) => (
            <button
              key={i}
              className={`px-5 py-2.5 my-1.5 ml-1.5 rounded-lg font-bold text-sm transition hover:bg-gray-200 active:bg-gray-300 ${tab == t && "bg-gray-200"}`}
              onClick={() => setTab(t as Tabs)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="p-5">
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
