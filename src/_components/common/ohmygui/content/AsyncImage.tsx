import type { UIProps, UIStyle } from "../_types";
import "../theme.css";
import {
  useEffect,
  useState,
  type ComponentPropsWithRef,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import { twMerge } from "tailwind-merge";
import { type ImageFit } from "./Image";

export type AsyncImageProps = UIProps & Omit<
  ComponentPropsWithRef<"img">,
  "alt" | "src"
> & {
  alt: string;
  aspectRatio?: number | string;
  fallback?: ReactNode;
  fit?: ImageFit;
  placeholder?: ReactNode;
  /** Decorative low-resolution thumbnail, removed once the useful image loads. */
  placeholderSrc?: string;
  placeholderBlur?: string;
  retry?: number;
  src: string;
};

export function AsyncImage({
  alt,
  aspectRatio,
  className,
  fallback,
  fit = "contain",
  loading = "lazy",
  onError,
  onLoad,
  placeholder,
  placeholderSrc,
  placeholderBlur = "12px",
  retry = 0,
  src,
  style,
  ...props
}: AsyncImageProps) {
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading",
  );

  useEffect(() => {
    setAttempt(0);
    setStatus("loading");
  }, [src]);

  const fitClass =
    fit === "cover"
      ? "object-cover"
      : fit === "fill"
        ? "object-fill"
        : fit === "none"
          ? "object-none"
          : fit === "scale-down"
            ? "object-scale-down"
            : "object-contain";

  function handleError(event: SyntheticEvent<HTMLImageElement>) {
    onError?.(event);
    if (attempt < Math.max(0, retry)) {
      setStatus("loading");
      setAttempt((current) => current + 1);
    } else {
      setStatus("error");
    }
  }

  return (
    <span data-ui="AsyncImage"
      className="relative inline-block max-w-full"
      style={{ aspectRatio }}
      data-state={status}
      aria-busy={status === "loading" || undefined}
    >
      {status === "error" ? (
        fallback ?? (
          <span role="img" aria-label={alt} className="inline-flex">
            Image unavailable
          </span>
        )
      ) : (
        <>
          <img
            {...props}
            key={`${src}-${attempt}`}
            alt={alt}
            className={twMerge(
              "block max-w-full transition-opacity duration-[var(--ui-duration-fast)]",
              fitClass,
              status === "loading" && "opacity-0",
              className,
            )}
            onError={handleError}
            onLoad={(event) => {
              setStatus("loaded");
              onLoad?.(event);
            }}
            loading={loading}
            src={src}
            style={style}
          />
          {status === "loading" && (
            <span data-slot="placeholder" aria-hidden="true" className="absolute inset-0 overflow-hidden">
              {placeholderSrc && <img data-slot="thumbnail" alt="" src={placeholderSrc} className="ui-decorative-blur absolute size-full object-cover" style={{ "--ui-content-blur": placeholderBlur } as UIStyle} />}
              {placeholder ?? (!placeholderSrc && <span className="block size-full animate-pulse bg-[var(--surface-secondary)] motion-reduce:animate-none" />)}
            </span>
          )}
        </>
      )}
    </span>
  );
}
