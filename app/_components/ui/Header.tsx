export default function Header({children}: {children: React.ReactNode}) {
  return (
    <div className="bg-emerald-500/30 py-12 px-8">
      <div className="w-full mx-auto sm:w-[500px] md:w-[700px] lg:w-[1000px] xl:w-[1200px]">
        <h2 className="text-3xl font-semibold">{children}</h2>
      </div>
    </div>
  );
}
