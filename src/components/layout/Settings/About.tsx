import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import Button from "@components/global/Button";

const About = () => {
  const [version, setVersion] = useState<string>("");

  useEffect(() => {
    invoke<string>("get_version").then(setVersion).catch(console.error);
  }, []);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-center">
      <div className="flex justify-center">
        <a
          href="https://github.com/slekup/big-brain"
          target="_blank"
          rel="noreferrer"
          draggable={false}
          className="mx-1"
        >
          <Button label="GitHub" size="sm" variant="secondary" />
        </a>
      </div>
      <p className="mt-8">Version {version}</p>
      <p className="mt-2">Apache 2.0 or MIT</p>
      <p className="mt-2">Copyright &copy; {new Date().getFullYear()} Slekup</p>
    </div>
  );
};

export default About;
