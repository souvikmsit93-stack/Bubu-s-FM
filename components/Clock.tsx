"use client";
import { useEffect, useState } from "react";

/** Renders nothing until mounted so server and client markup agree. */
export default function Clock() {
  const [now, setNow] = useState<string>();
  useEffect(() => {
    const read = () => setNow(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }).toLowerCase());
    read();
    const id = window.setInterval(read, 20_000);
    return () => window.clearInterval(id);
  }, []);
  return <span className="clock">{now ?? ""}</span>;
}
