/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable jsx-a11y/label-has-associated-control */

"use client";

import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";

import { FileVideo, Loader, Upload } from "lucide-react";

import { fetchFile } from "@ffmpeg/util";

import { axiosInstance } from "../lib/axiosInstance";
import { getFFmpeg } from "../lib/ffmpeg";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";

type STATUS = "waiting" | "converting" | "uploading" | "generating" | "success";

const statusMessaging = {
  converting: "Converting...",
  generating: "Generating transcript...",
  uploading: "Uploading...",
  success: "Success!",
};

interface VideoInputProps {
  onVideoUploaded: (videoId: string) => void;
}

export function VideoInputForm({ onVideoUploaded }: VideoInputProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [status, setStatus] = useState<STATUS>("waiting");
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  const shouldDisable = status !== "waiting";

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

    const audioFileBlob = new Blob([data], { type: "audio/mpeg" });
    const audioFile = new File([audioFileBlob], "audio.mp3", {
      type: "audio/mpeg",
    });

    return audioFile;
  };

  const handleUploadVideo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const prompt = promptInputRef.current?.value;

    if (!videoFile) {
      return;
    }

    setStatus("converting");

    const audioFile = await convertVideoToAudio(videoFile);

    const data = new FormData();
    data.append("file", audioFile);

    setStatus("uploading");

    const response = await axiosInstance.post(
      "http://localhost:3334/videos/upload",
      data,
    );

    const videoId = response.data.info.id;

    setStatus("generating");

    await axiosInstance.post(
      `http://localhost:3334/videos/${videoId}/transcription`,
      {
        prompt,
      },
    );

    setStatus("success");
    onVideoUploaded(videoId);
  };

  return (
    <form className="space-y-6" onSubmit={handleUploadVideo}>
      <label
        htmlFor="video"
        className="relative border w-full flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5 data-[disabled=true]:cursor-not-allowed"
        data-disabled={shouldDisable}
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
        disabled={shouldDisable}
        className="sr-only"
        onChange={handleFileSelected}
      />

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="transcription-prompt">Transcription Prompt</Label>
        <Textarea
          ref={promptInputRef}
          disabled={shouldDisable}
          id="transcription-prompt"
          className="h-19 leading-relaxed resize-none"
          placeholder="include keywords mentioned on video separated by comma"
        />
      </div>

      <Button
        type="submit"
        disabled={shouldDisable}
        className="w-full data-[success=true]:bg-green-400 "
        data-success={status === "success"}
      >
        {status === "waiting" ? (
          <>
            Upload Video
            <Upload className="w-4 h-4 ml-2" />
          </>
        ) : (
          <div
            className="group flex gap-2 items-center "
            data-success={status === "success"}
          >
            <span className="text-popover-foreground group-data-[success=true]:text-destructive">
              {statusMessaging[status]}
            </span>
            <Loader className="w-4 h-4 text-popover-foreground animate-spin group-data-[success=true]:hidden" />
          </div>
        )}
      </Button>
    </form>
  );
}
