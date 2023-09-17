"use client";

import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function ModelOptions() {
  return (
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
  );
}
