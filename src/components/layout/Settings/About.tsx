import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

const About = () => {
  const [version, setVersion] = useState<string>("");

  useEffect(() => {
    invoke<string>("get_version")
      .then((res) => setVersion(res))
      .catch(console.error);
  }, []);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-center">
      <p className="">Version {version}</p>
      <p className="mt-2">Copyright &copy; {new Date().getFullYear()} Slekup</p>
    </div>
  );
};

export default About;
