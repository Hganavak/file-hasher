import { StoryblokComponent, useStoryblok } from "@storyblok/react";
import { WorkerContext } from "@/storyblok/WorkerContext";
import { getStoryblokVersion } from "@/storyblok/init";

export interface AppProps {
  createWorker?: () => Worker; // Used to mock the worker for testing
}

function App({ createWorker }: AppProps) {
  const story = useStoryblok("home", { version: getStoryblokVersion() });

  if (!story?.content) {
    return null;
  }

  return (
    <WorkerContext.Provider value={createWorker}>
      <StoryblokComponent blok={story.content} />
    </WorkerContext.Provider>
  );
}

export default App;
