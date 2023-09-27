import React from "react";
import { Loader } from "@/components/loader";
import { cn } from "@/utils/cn";

const rounded = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

type Props = {
  src: string;
  alt: string;
  className?: string;
  radius?: keyof typeof rounded;
  isLoading?: boolean;
  height?: number;
  width?: number;
  isStyle?: boolean;
};

export const Image = ({
  src,
  alt,
  radius = "full",
  className = "",
  isLoading = false,
  height = 38,
  width = 38,
  isStyle = true,
}: Props) => {
  return isLoading ? (
    <Loader size="xl" />
  ) : (
    <picture
      className={cn(
        "aspect-square inline-block object-cover",
        rounded[radius],
        className
      )}
      style={isStyle ? { height, width } : {}}
    >
      <source srcSet={src} type="image/webp" />
      <img
        alt={alt}
        className={cn("h-full w-full", rounded[radius], className)}
        height={height}
        loading="lazy"
        src={src}
        width={width}
      />
    </picture>
  );
};
