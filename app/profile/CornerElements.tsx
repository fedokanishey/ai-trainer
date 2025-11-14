export default function CornerElements() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute left-0 top-0 h-4 w-4 border-t border-l border-primary/40" />
      <div className="absolute right-0 top-0 h-4 w-4 border-t border-r border-primary/40" />
      <div className="absolute left-0 bottom-0 h-4 w-4 border-b border-l border-primary/40" />
      <div className="absolute right-0 bottom-0 h-4 w-4 border-b border-r border-primary/40" />
    </div>
  );
}
