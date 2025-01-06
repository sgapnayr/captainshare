"use client";

import axios from "axios";

export default function Home() {
  async function testAPI() {
    console.log("THIS IS WORKING");
    const res = await axios.post("/api/hello", {
      name: "Hello World",
    });

    console.log("THIS IS WORKING 2");

    console.log(res.data);
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <button
        className="
        bg-blue-500
        hover:bg-blue-700
        text-white
        font-bold
        py-2
        px-4
        rounded
        active:bg-blue-800
      "
        onClick={testAPI}
      >
        POST TO MONGO DB
      </button>
    </div>
  );
}
