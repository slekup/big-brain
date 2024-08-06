"use client";

import "@styles/app.css";
import Sidebar from "@components/layout/Sidebar";
import Toasts from "../components/global/Toasts/Toasts";
import { Provider } from "react-redux";
import { store } from "../store";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const params = useSearchParams();

  /**
   * Disable dragging links, images, and buttons.
   */
  const disableDrag = () => {
    const elements = ["a", "img", "button"];
    elements.forEach((elementName) => {
      let element = document.getElementsByTagName(elementName);
      for (let i = 0; i < element.length; i++) {
        element[i].setAttribute("draggable", "false");
      }
    });
  };

  useEffect(() => {
    setTimeout(disableDrag, 500);
  }, [pathname, params]);

  return (
    <html lang="en">
      <body className="absolute flex w-full h-full no-select cursor-default">
        <Provider store={store}>
          <Sidebar />
          <div className="relative h-full w-full">{children}</div>
          <Toasts />
        </Provider>
      </body>
    </html>
  );
}
