export const metadata = {
  robots: { index: false, follow: false },
};

export default function EmbedWidgetLayout({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen p-3 sm:p-5">{children}</main>;
}
