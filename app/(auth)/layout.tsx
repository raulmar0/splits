export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-5"
      style={{ background: "var(--bg)" }}
    >
      <div className="w-full max-w-[380px]">{children}</div>
    </div>
  );
}
