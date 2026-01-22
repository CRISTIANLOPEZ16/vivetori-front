type Props = { children: React.ReactNode };

export function Badge({ children }: Props) {
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium">
      {children}
    </span>
  );
}
