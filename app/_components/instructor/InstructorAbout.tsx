

export default function InstructorAbout({description}: {description: string;}) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">About Me</h2>
      <p>{description}</p>
    </div>
  )
}
