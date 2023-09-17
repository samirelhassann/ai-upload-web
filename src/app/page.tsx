"use client";

import { useState } from "react";

import { useCompletion } from "ai/react";
import { Github, Wand2 } from "lucide-react";

import ModelOptions from "./components/modelOptions";
import PromptOptions from "./components/promptOptions";
import TemperatureOptions from "./components/temperatureOptions";
import { Button } from "./components/ui/button";
import { Separator } from "./components/ui/separator";
import { Textarea } from "./components/ui/textarea";
import { VideoInputForm } from "./components/videoInputForm";

export default function Home() {
  const [videoId, setVideoId] = useState("");
  const [temperature, setTemperature] = useState(0.5);

  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
  } = useCompletion({
    api: "http://localhost:3334/ai/completion",
    body: {
      videoId,
      temperature,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });

  return (
    <main className="min-h-screen flex flex-col">
      <div className="px-6 py-3 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold">upload.ai</h1>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Developed with Love with help by Rocketseat
          </span>

          <Separator orientation="vertical" className="h-6" />

          <Button variant="outline">
            <Github className="h-4 w-4 mr-2" />
            Github
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6 flex gap-6">
        <div className="flex flex-col flex-1 gap-4">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea
              className="resize-none p-5 leading-relaxed"
              placeholder="include the prompt for the IA"
              value={input}
              onChange={handleInputChange}
            />
            <Textarea
              className="resize-none p-5 leading-relaxed"
              placeholder="Result from the IA"
              readOnly
              value={completion}
            />
          </div>

          <p className="text-sm text-muted-foreground">
            Remember: you can use the variable{" "}
            <code className="text-violet-400">{"{transcription}"}</code> in your
            prompt to add a content
          </p>
        </div>
        <aside className="w-80 space-y-6">
          <VideoInputForm onVideoUploaded={setVideoId} />

          <Separator />

          <form onSubmit={handleSubmit} className="space-y-4">
            <PromptOptions onPromptSelected={setInput} />

            <ModelOptions />

            <Separator />

            <TemperatureOptions onTemperatureSelected={setTemperature} />

            <Separator />

            <Button type="submit" disabled={isLoading} className="w-full">
              Execute
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </aside>
      </div>
    </main>
  );
}
