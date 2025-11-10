

export default function Stats({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex gap-2 w-full justify-between items-center">
        {children}
    </div>
  )
}
