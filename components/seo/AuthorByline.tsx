import Link from "next/link";
import { author } from "@/lib/author";

// Visible byline for the editorial spokes — the human "Who" signal Google's
// helpful-content guidance asks for, linking to the author's profile page. The
// avatar is an illustration (see public/authors/mara-whitlock.svg), so a plain
// <img> is intentional; next/image would only add SVG-allowlist config for no
// rendering benefit on a tiny inline mark.
export function AuthorByline({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={author.avatar}
        alt=""
        width={32}
        height={32}
        loading="lazy"
        className="h-8 w-8 shrink-0 rounded-full ring-1 ring-patina-200"
      />
      <p className="text-sm text-patina-800/80">
        By{" "}
        <Link
          href={author.path}
          rel="author"
          className="font-medium text-patina-800 underline underline-offset-2 hover:text-patina-900"
        >
          {author.name}
        </Link>
        <span className="text-patina-muted"> · {author.role}</span>
      </p>
    </div>
  );
}
