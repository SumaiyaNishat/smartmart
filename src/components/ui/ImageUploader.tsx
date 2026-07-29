"use client";

import * as React from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Trash2, Loader2, RefreshCw, Plus } from "lucide-react";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  productId?: string;
  onUploadStateChange?: (uploading: boolean) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onChange,
  productId,
  onUploadStateChange,
}) => {
  const [uploading, setUploading] = React.useState(false);
  const [replacingIndex, setReplacingIndex] = React.useState<number | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const replaceInputRef = React.useRef<HTMLInputElement>(null);

  // Notify parent component when uploading state changes (e.g. to disable submit button)
  React.useEffect(() => {
    if (onUploadStateChange) {
      onUploadStateChange(uploading);
    }
  }, [uploading, onUploadStateChange]);

  const validateFile = (file: File): boolean => {
    // 5MB limit
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error(`"${file.name}" is too large. Max size is 5MB.`);
      return false;
    }

    // Mime types check
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(`"${file.name}" has an invalid format. Only JPG, JPEG, PNG, and WEBP are allowed.`);
      return false;
    }

    // Extension check
    const extension = file.name.split(".").pop()?.toLowerCase();
    const allowedExtensions = ["jpg", "jpeg", "png", "webp"];
    if (!allowedExtensions.includes(extension || "")) {
      toast.error(`"${file.name}" has an invalid extension.`);
      return false;
    }

    return true;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, replaceIdx: number | null = null) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const toastId = toast.loading(replaceIdx !== null ? "Replacing image..." : "Uploading image(s)...");

    try {
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!validateFile(file)) continue;

        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data?.success && response.data?.url) {
          uploadedUrls.push(response.data.url);
        }
      }

      if (uploadedUrls.length > 0) {
        if (replaceIdx !== null) {
          const oldUrl = images[replaceIdx];
          try {
            await axios.delete("/api/upload", {
              data: { url: oldUrl, productId },
            });
          } catch (delErr) {
            console.error("Failed to delete old replaced image:", delErr);
          }

          const nextImages = [...images];
          nextImages[replaceIdx] = uploadedUrls[0];
          onChange(nextImages);
          toast.success("Image replaced successfully", { id: toastId });
        } else {
          onChange([...images, ...uploadedUrls]);
          toast.success(`Successfully uploaded ${uploadedUrls.length} image(s)`, { id: toastId });
        }
      } else {
        toast.error("Upload failed", { id: toastId });
      }
    } catch (error: unknown) {
      console.error("Upload error:", error);
      let message = "Failed to upload image(s)";
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          message = error.response.data?.error || "Admin permission is required.";
        } else if (error.response?.status === 401) {
          message = error.response.data?.error || "Please log in to upload images.";
        } else {
          message = error.response?.data?.error || error.response?.data?.message || error.message || "Failed to upload image(s)";
        }
      } else if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message, { id: toastId });
    } finally {
      setUploading(false);
      setReplacingIndex(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (replaceInputRef.current) replaceInputRef.current.value = "";
    }
  };

  const handleRemoveImage = async (index: number) => {
    const urlToRemove = images[index];
    const toastId = toast.loading("Removing image...");

    try {
      await axios.delete("/api/upload", {
        data: { url: urlToRemove, productId },
      });

      const nextImages = images.filter((_, idx) => idx !== index);
      onChange(nextImages);
      toast.success("Image removed successfully", { id: toastId });
    } catch (error: unknown) {
      console.error("Remove image error:", error);
      const nextImages = images.filter((_, idx) => idx !== index);
      onChange(nextImages);
      toast.error("Removed from form. Cloudinary sync failed.", { id: toastId });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerReplaceInput = (index: number) => {
    setReplacingIndex(index);
    setTimeout(() => {
      replaceInputRef.current?.click();
    }, 50);
  };

  return (
    <div className="space-y-4">
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
        Product Images *
      </label>

      {/* Grid of uploaded images / previews */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {images.map((url, index) => (
          <div
            key={url + index}
            className="group relative aspect-square bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex items-center justify-center shadow-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`Product preview ${index + 1}`}
              className="w-full h-full object-cover p-1.5 rounded-2xl"
            />

            {/* Overlays / Action controls */}
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => triggerReplaceInput(index)}
                disabled={uploading}
                className="p-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 rounded-xl hover:scale-105 transition active:scale-95 cursor-pointer shadow-md"
                title="Replace image"
              >
                <RefreshCw size={14} />
              </button>
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                disabled={uploading}
                className="p-2 bg-red-500 text-white rounded-xl hover:scale-105 transition active:scale-95 cursor-pointer shadow-md"
                title="Remove image"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Index tag */}
            <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-lg">
              {index === 0 ? "Main" : `#${index + 1}`}
            </span>
          </div>
        ))}

        {/* Upload Slot Trigger */}
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={uploading}
          className="aspect-square border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:text-primary transition cursor-pointer bg-slate-50/50 dark:bg-slate-950/30 gap-1.5"
        >
          {uploading && replacingIndex === null ? (
            <>
              <Loader2 className="animate-spin text-primary" size={24} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Uploading...</span>
            </>
          ) : (
            <>
              <Plus size={24} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Add Image</span>
            </>
          )}
        </button>
      </div>

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileUpload(e)}
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
      />
      <input
        type="file"
        ref={replaceInputRef}
        onChange={(e) => handleFileUpload(e, replacingIndex)}
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
      />

      <p className="text-[10px] text-slate-400 font-medium">
        Accepted files: JPG, JPEG, PNG, WEBP. Maximum file size: 5 MB. First image will be used as the primary card preview.
      </p>
    </div>
  );
};
