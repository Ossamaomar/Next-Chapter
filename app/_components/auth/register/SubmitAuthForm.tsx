import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MoonLoader } from "react-spinners";

export default function SubmitAuthForm({
  isLoading,
  type,
}: {
  isLoading: boolean;
  type: "login" | "register";
}) {
  return (
    <div className="flex flex-col gap-2">
      <Link
        href={type === "register" ? "/auth/login" : "/auth/register"}
        className="text-sm"
      >
        {type === "register"
          ? "Already have an account?"
          : "Don't have an account?"}
      </Link>
      <Button type="submit" className="w-fit">
        {isLoading ? (
          <MoonLoader size={22} color="#ffffff" />
        ) : type === "register" ? (
          "Create account"
        ) : (
          "Login"
        )}
      </Button>
    </div>
  );
}
