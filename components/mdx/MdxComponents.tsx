import Link from "next/link";
import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-10 mb-4 text-2xl font-bold text-patina-900 sm:text-3xl"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-8 mb-3 text-xl font-semibold text-patina-900"
      {...props}
    />
  ),
  p: (props) => (
    <p className="my-4 text-base leading-relaxed text-patina-800/85" {...props} />
  ),
  ul: (props) => (
    <ul className="my-4 list-disc space-y-2 pl-6 text-patina-800/85" {...props} />
  ),
  ol: (props) => (
    <ol className="my-4 list-decimal space-y-2 pl-6 text-patina-800/85" {...props} />
  ),
  li: (props) => <li className="leading-relaxed" {...props} />,
  strong: (props) => <strong className="font-semibold text-patina-900" {...props} />,
  em: (props) => <em className="italic" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="my-6 border-l-4 border-patina-300 bg-cream-100 px-5 py-3 italic text-patina-800"
      {...props}
    />
  ),
  hr: (props) => <hr className="my-8 border-patina-100" {...props} />,
  a: ({ href, ...rest }) => {
    const isInternal = href?.startsWith("/");
    if (isInternal && href) {
      return (
        <Link
          href={href}
          className="text-patina-700 underline underline-offset-2 hover:text-patina-900"
          {...rest}
        />
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-patina-700 underline underline-offset-2 hover:text-patina-900"
        {...rest}
      />
    );
  },
  table: (props) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="border-b border-patina-200 px-3 py-2 text-left font-semibold text-patina-900"
      {...props}
    />
  ),
  td: (props) => (
    <td className="border-b border-patina-100 px-3 py-2 text-patina-800/85" {...props} />
  ),
};
