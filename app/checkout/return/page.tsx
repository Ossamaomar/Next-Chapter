import CheckoutReturn from "@/app/_components/checkout/CheckoutReturn";
import { stripe } from "@/app/_lib/stripe";

export default async function page({ searchParams }) {
  const { session_id } = await searchParams;
  const {
    status,
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });
  return (
    <div className="px-8 py-10">
      <CheckoutReturn sessionId={session_id} status={status} />
    </div>
  );
}
