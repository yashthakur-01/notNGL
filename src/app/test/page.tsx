"use client";

import { useState } from "react";

export default function test() {
  const [content, setContent] = useState("");

  const askAI = async () => {
    setContent("");
    try {
      const res = await fetch("/api/suggest-message", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const reader = res?.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        setContent((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch (error: any) {
      // console.log(error);
      setContent(error);
    }
  };

  return (
    <>
      <h1>{content}</h1>
      <br></br>
      <button type="button" onClick={askAI}>
        {" "}
        ask{" "}
      </button>
    </>
  );
}
