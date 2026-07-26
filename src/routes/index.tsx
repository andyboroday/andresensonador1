import { createFileRoute } from "@tanstack/react-router";
import { DreamScene } from "@/components/DreamScene";

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
    <div className="flex-1 min-h-0 overflow-hidden">
      <DreamScene />
    </div>
  );
}
