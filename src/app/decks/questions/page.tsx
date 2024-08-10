"use client";

import { useSearchParams } from "next/navigation";
import React from "react";

export default function Question() {
  const params = useSearchParams();
  const id = params.get("id");

  return <div className="">{id}</div>;
}
