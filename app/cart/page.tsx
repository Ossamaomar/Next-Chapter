import CartContainer from "../_components/cart/CartContainer";
import CartHeader from "../_components/cart/CartHeader";

export default function page() {
  return (
    <div className="space-y-4">
      <CartHeader />
      <div className="w-full py-12 px-8">
        <CartContainer />
      </div>
    </div>
  );
}
