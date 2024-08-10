import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

const Appearance = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const { themes, theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    mounted && (
      <div>
        <p className="uppercase text-sm font-extrabold">Theme:</p>
        <div className="mt-2 grid grid-cols-2 gap-4">
          {themes.map((t, i) => (
            <button key={i} onClick={() => setTheme(t)} data-theme={t}>
              <div
                className={`relative bg-bg text-fg h-36 min-w-full rounded-md transition ${theme === t ? "border-4 border-success" : "border-2 border-border hover:border-success-hover active:border-success"}`}
              >
                <div className="absolute w-10 h-full left-0 top-0 border-r border-border">
                  <div className="border-b border-border">
                    <p className="mt-1 mb-1.5 h-[2px] w-10/12 mx-auto rounded-lg bg-fg"></p>
                  </div>
                  <div className="mt-0.5">
                    <div className="mt-1 h-1.5 w-10/12 mx-auto rounded-[2px] bg-primary"></div>
                    <div className="mt-1 h-1.5 w-10/12 mx-auto rounded-[2px] bg-secondary"></div>
                    <div className="mt-1 h-1.5 w-10/12 mx-auto rounded-[2px] bg-secondary"></div>
                    <div className="mt-1 h-1.5 w-10/12 mx-auto rounded-[2px] bg-secondary"></div>
                    <div className="mt-1 h-1.5 w-10/12 mx-auto rounded-[2px] bg-secondary"></div>
                  </div>
                  <div className="absolute bottom-2 left-0">
                    <div className="h-1.5 w-10/12 mx-auto rounded-[2px] bg-secondary"></div>
                  </div>
                </div>
                <div className="absolute left-10 right-0 top-0 h-full">
                  <div className="absolute justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="h-1 rounded-lg bg-fg w-10 mx-auto"></div>
                    <div className="mt-2 grid grid-cols-2 gap-1">
                      <div className="h-4 w-8 rounded-sm bg-purple-500"></div>
                      <div className="h-4 w-8 rounded-sm bg-lime-500"></div>
                      <div className="h-4 w-8 rounded-sm bg-blue-500"></div>
                      <div className="h-4 w-8 rounded-sm bg-orange-500"></div>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  );
};

export default Appearance;
