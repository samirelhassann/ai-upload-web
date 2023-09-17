"use client";

import { useEffect, useState } from "react";

import { GetPromptsService } from "../services/getPromptsService/GetPromptsService";
import { Prompt } from "../services/getPromptsService/model/GetPromptsResponse";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Skeleton } from "./ui/skeleton";

export function Loading() {
  return (
    <div className="space-y-2">
      <Label>Prompt</Label>
      <Skeleton className="w-full h-8" />

      <span className="block text-sm text-muted-foreground italic">
        You can customize this option soon
      </span>
    </div>
  );
}

interface PromptOptionProps {
  onPromptSelected: (template: string) => void;
}

export default function PromptOptions({ onPromptSelected }: PromptOptionProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  useEffect(() => {
    GetPromptsService()
      .then((response) => {
        setPrompts(response);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handlePromptSelected = (promptId: string) => {
    const template = prompts.find((prompt) => prompt.id === promptId)?.template;

    if (!template) {
      return;
    }

    onPromptSelected(template);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-2">
      <Label>Prompt</Label>
      <Select onValueChange={handlePromptSelected}>
        <SelectTrigger>
          <SelectValue placeholder="Select a prompt" />
        </SelectTrigger>

        <SelectContent>
          {prompts.map((prompt) => (
            <SelectItem key={prompt.id} value={prompt.id}>
              {prompt.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="block text-sm text-muted-foreground italic">
        You can customize this option soon
      </span>
    </div>
  );
}
