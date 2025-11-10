import Link from "next/link";
import { ReactNode } from "react";

export default function SocialLink({
  link,
  children,
}: {
  link: string;
  children: ReactNode;
}) {
  return <Link className="border p-2 rounded-lg hover:bg-cyan-600/20" href={link}>{children}</Link>;
}
