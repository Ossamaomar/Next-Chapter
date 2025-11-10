export default function CoursesRow({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid gap-4 xl:grid-cols-4 lg:grid-cols-3  sm:grid-cols-2 grid-cols-1">
      {children}
    </div>
  );
}
