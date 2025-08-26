export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-48 rounded bg-muted animate-pulse" />
      <div className="h-12 rounded bg-muted animate-pulse" />
      <div className="h-[500px] rounded bg-muted animate-pulse" />
    </div>
  );
}
