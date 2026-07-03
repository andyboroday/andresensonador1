import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { DreamScene } from "@/components/DreamScene";
import heroBackground from "@/assets/backgrounds/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Andres Ensonador — Dreams are messages from the deep" },
      {
        name: "description",
        content:
          "The artistic universe of Andres Ensonador: dreamlike particle visions, projects, articles and artwork.",
      },
      { property: "og:title", content: "Andres Ensonador" },
      { property: "og:description", content: "Dreams are messages from the deep" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{
  backgroundImage: `
          linear-gradient(
  to bottom,
  rgba(5,5,8,0.2) 0%,
  rgba(5,5,8,0.30) 25%,
  rgba(5,5,8,0.50) 55%,
  rgba(5,5,8,0.85) 100%
),
          url(${heroBackground})
        `,
        backgroundSize: "100% auto",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat"
}}
    >
      <Hero />
      <Navbar />
      <DreamScene />
    </div>
  );
}
