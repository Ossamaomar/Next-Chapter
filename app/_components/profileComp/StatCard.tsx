

export default function StatCard({
  children,
  title,
  borderColor,
  value
}: Readonly<{
  children: React.ReactNode;
  title: string;
  borderColor: string;
  value: number;
}>) {
  return (
    <div className={`flex gap-4 p-4 shadow-2xl w-full items-center rounded-xl border-2 border-${borderColor}-600`}>
        {children}
        <div>
            <h4 className="text-sm font-bold text-stone-400">{title}</h4>
            <p className="text-lg font-semibold">{value}</p>
        </div>
    </div>
  )
}
