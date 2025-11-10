export default function InstructorHeader({
  name,
  title,
}: {
  name: string;
  title: string;
}) {
  return (
    <div className="bg-emerald-500/30 py-12 px-8">
        <h3 className="text-lg">INSTRUCTOR</h3>
        <h2 className="text-3xl font-semibold">{name}</h2>
        <h4>{title}</h4>
    </div>
  );
}
