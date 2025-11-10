import CartContainer from "../_components/cart/CartContainer";
import CartHeader from "../_components/cart/CartHeader";

export default function page() {
  return (
    <div className="space-y-4">
      <CartHeader />
      <div className="w-full px-8 py-6">
        <CartContainer />
      </div>
    </div>
  );
}
