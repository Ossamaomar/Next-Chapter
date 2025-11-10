export default function InstructorStats({
  students,
  ratings,
}: {
  students: number;
  ratings: number;
}) {
  return (
    <div className="flex gap-6 lg:mt-10">
      <div>
        <p className="font-semibold">{students}</p>
        <p className="text-sm text-gray-500">Total learners</p>
      </div>
      <div>
        <p className="font-semibold">{ratings}</p>
        <p className="text-sm text-gray-500">Review</p>
      </div>
    </div>
  );
}
