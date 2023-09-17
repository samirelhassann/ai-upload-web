"use client";

/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";

import { FileVideo, Upload } from "lucide-react";

import { fetchFile } from "@ffmpeg/util";

import { getFFmpeg } from "../lib/ffmpeg";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";

export function VideoInputForm() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  const previewUrl = useMemo(() => {
    if (!videoFile) {
      return null;
    }

    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.currentTarget;

    if (!files) {
      return;
    }

    const selectedFile = files[0];
    setVideoFile(selectedFile);
  };

  const convertVideoToAudio = async (video: File) => {
    console.log("• [LOG] - convert started");

    const ffmpeg = await getFFmpeg();

    await ffmpeg.writeFile("input.mp4", await fetchFile(video));

    ffmpeg.on("progress", (progress) =>
      console.log(
        `[LOG][ffmpeg progress] - ${Math.round(progress.progress * 100)}`,
      ),
    );

    await ffmpeg.exec([
      "-i",
      "input.mp4",
      "-map",
      "0:a",
      "-b:a",
      "20k",
      "-acodec",
      "libmp3lame",
      "output.mp3",
    ]);

    const data = await ffmpeg.readFile("output.mp3");

    console.log("• [LOG] - passou");

    const audioFileBlob = new Blob([data], { type: "audio/mpeg" });
    const audioFile = new File([audioFileBlob], "audio.mp3", {
      type: "audio/mpeg",
    });

    console.log("• [LOG] - Convert Finished");

    return audioFile;
  };

  const handleUploadVideo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const prompt = promptInputRef.current?.value;

    if (!videoFile) {
      return;
    }

    const audioFile = await convertVideoToAudio(videoFile);

    console.log("• [LOG] - audioFile", audioFile);
  };

  return (
    <form className="space-y-6" onSubmit={handleUploadVideo}>
      <label
        htmlFor="video"
        className="relative border w-full flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5"
      >
        {previewUrl ? (
          <video
            src={previewUrl}
            controls={false}
            className="pointer-events-none absolute inset-0"
          />
        ) : (
          <>
            <FileVideo className="w-5 h-5" />
            Upload Video
          </>
        )}
      </label>

      <input
        type="file"
        id="video"
        accept="video/*"
        className="sr-only"
        onChange={handleFileSelected}
      />

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="transcription-prompt">Transcription Prompt</Label>
        <Textarea
          ref={promptInputRef}
          id="transcription-prompt"
          className="h-19 leading-relaxed resize-none"
          placeholder="include keywords mentioned on video separated by comma"
        />
      </div>

      <Button type="submit" className="w-full">
        Upload Video
        <Upload className="w-4 h-4 ml-2" />
      </Button>
    </form>
  );
}
