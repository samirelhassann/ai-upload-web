import { Github, Wand2 } from "lucide-react";

import { Button } from "./components/ui/button";
import { Label } from "./components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Separator } from "./components/ui/separator";
import { Slider } from "./components/ui/slider";
import { Textarea } from "./components/ui/textarea";
import { VideoInputForm } from "./components/videoInputForm";

export default function Home() {
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
            />
            <Textarea
              className="resize-none p-5 leading-relaxed"
              placeholder="Result from the IA"
              readOnly
            />
          </div>

          <p className="text-sm text-muted-foreground">
            Remember: you can use the variable{" "}
            <code className="text-violet-400">{"{transcription}"}</code> in your
            prompt to add a content
          </p>
        </div>
        <aside className="w-80 space-y-6">
          <VideoInputForm />

          <Separator />

          <form className="space-y-4">
            <div className="space-y-2">
              <Label>Prompt</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a prompt" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="title">Generate a Title</SelectItem>
                  <SelectItem value="description">
                    Generate a Description
                  </SelectItem>
                </SelectContent>
              </Select>

              <span className="block text-sm text-muted-foreground italic">
                You can customize this option soon
              </span>
            </div>

            <div className="space-y-2">
              <Label>Model</Label>
              <Select disabled defaultValue="gpt3.5">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="gpt3.5">GTP 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>

              <span className="block text-sm text-muted-foreground italic">
                You can customize this option soon
              </span>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Temperature</Label>

              <Slider min={0} max={1} step={0.1} defaultValue={[0.5]} />

              <span className="block text-sm text-muted-foreground italic leading-relaxed">
                Higher values will increase the creativity and with possible
                errors
              </span>
            </div>

            <Separator />

            <Button type="submit" className="w-full">
              Execute
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </aside>
      </div>
    </main>
  );
}
