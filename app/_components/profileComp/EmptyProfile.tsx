import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import Link from "next/link";
import { BsFolderPlus } from "react-icons/bs";

export function EmptyProfile() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BsFolderPlus />
        </EmptyMedia>
        <EmptyTitle>No Courses Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any courses yet. Get started by creating your
          first course.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button>
            <Link href={"/addCourse"}>Create Course</Link>
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}
