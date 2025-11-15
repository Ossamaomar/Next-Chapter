import { signInWithGoogle } from "@/app/_services/auth";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function GoogleSignInButton() {
  async function handleSignIn() {
    await signInWithGoogle();
  }

  return (
    <form action={handleSignIn}>
      <Button className="flex items-center gap-6 text-lg border border-primary-300 px-10 py-6 font-medium hover:text-black hover:bg-white cursor-pointer">
        <Image
          src="https://authjs.dev/img/providers/google.svg"
          alt="Google logo"
          height="24"
          width="24"
        />
        <span>Continue with Google</span>
      </Button>
    </form>
  );
}
