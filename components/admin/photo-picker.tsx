"use client";

import { useState } from "react";
import { Camera, ImagePlus, Loader2, Upload } from "lucide-react";
import { resizeImageToDataUrl } from "@/lib/image";

const buttonClass =
  "inline-flex cursor-pointer items-center justify-center gap-2 px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 focus-within:ring-2 focus-within:ring-blue-500";

interface PhotoPickerProps {
  photo: string;
  onChange: (photo: string) => void;
  onError: (message: string | null) => void;
  onBusyChange: (busy: boolean) => void;
}

export function PhotoPicker({ photo, onChange, onError, onBusyChange }: PhotoPickerProps) {
  const [busy, setBusy] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow picking the same file again
    if (!file) return;

    onError(null);
    setBusy(true);
    onBusyChange(true);
    try {
      onChange(await resizeImageToDataUrl(file));
    } catch {
      onError("Could not read that image. Please use a JPG, PNG or WebP photo.");
    } finally {
      setBusy(false);
      onBusyChange(false);
    }
  }

  return (
    <div>
      <div className="flex aspect-4/3 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-slate-300 bg-slate-50">
        {busy ? (
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        ) : photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="Selected slipper" className="h-full w-full object-contain" />
        ) : (
          <ImagePlus className="w-8 h-8 text-slate-400" />
        )}
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <label className={buttonClass}>
          <Camera className="w-4 h-4" />
          Take Photo
          {/* capture opens the rear camera on phones; computers show a file picker */}
          <input type="file" accept="image/*" capture="environment" onChange={handleFile} className="sr-only" />
        </label>
        <label className={buttonClass}>
          <Upload className="w-4 h-4" />
          Upload Photo
          <input type="file" accept="image/*" onChange={handleFile} className="sr-only" />
        </label>
      </div>
    </div>
  );
}
