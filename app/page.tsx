"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("../components/Map"), {
  ssr: false,
});

export default function Home() {
  return (
    <main style={{ padding: 20 }}>
      <h1>Real Estate Forecast AI</h1>
      <Map />
    </main>
  );
}
