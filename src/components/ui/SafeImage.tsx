/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import * as React from "react";
import Image, { ImageProps } from "next/image";

export const SafeImage: React.FC<ImageProps> = ({ src, alt, ...props }) => {
  const [imgSrc, setImgSrc] = React.useState<string>("");

  React.useEffect(() => {
    if (!src) {
      setImgSrc("/placeholder.png");
      return;
    }

    // Validate hostname if it is a remote URL
    if (typeof src === "string" && (src.startsWith("http://") || src.startsWith("https://"))) {
      try {
        const url = new URL(src);
        const allowedHosts = [
          "res.cloudinary.com"
        ];

        // Check if the hostname is allowed (either exact match or ending with it)
        const isAllowed = allowedHosts.some(host => url.hostname === host || url.hostname.endsWith("." + host));
        if (!isAllowed) {
          setImgSrc("/placeholder.png");
          return;
        }
      } catch {
        setImgSrc("/placeholder.png");
        return;
      }
    }

    setImgSrc(src as string);
  }, [src]);

  if (!imgSrc) {
    // Return a placeholder structure to maintain layout while validating
    return <div className={props.className} style={{ width: props.width, height: props.height }} />;
  }

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt || "Product Image"}
      onError={() => {
        setImgSrc("/placeholder.png");
      }}
    />
  );
};
