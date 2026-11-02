import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import duo from "@/assets/fitness-duo.png.asset.json";
import { bodyContours } from "@/lib/body-contours";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fitness Duo — Train Together" },
      { name: "description", content: "Strength and fitness training for men and women." },
      { property: "og:title", content: "Fitness Duo — Train Together" },
      { property: "og:description", content: "Strength and fitness training for men and women." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="relative w-full max-w-[1402px] overflow-hidden" style={{ aspectRatio: "1402 / 1122" }}>
        <img src={duo.url} alt="Man and woman lifting dumbbells under a green spotlight" className="absolute inset-0 h-full w-full" />
        <svg className="body-overlay" viewBox="0 0 960 768" onPointerLeave={() => setActive(null)}>
          {bodyContours.map((person) => (
            <g key={person.id} className="body-person" data-active={active === person.id}>
              <g className="body-light" aria-hidden="true">
                <path d={person.outline} pathLength={1000} className="body-light-trail" />
                <path d={person.outline} pathLength={1000} className="body-light-core" />
                <path d={person.outline} pathLength={1000} className="body-light-tip" />
              </g>
              <path d={person.outline} className="body-hit" aria-label={person.label}
                onPointerEnter={() => setActive(person.id)} onPointerLeave={() => setActive(null)} />
            </g>
          ))}
        </svg>
      </div>
    </main>
  );
}