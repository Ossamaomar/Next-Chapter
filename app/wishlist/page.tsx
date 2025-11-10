import Header from "../_components/ui/Header";
import WishlistRow from "../_components/wishlist/WishlistRow";

export default function page() {
  return (
    <div className="space-y-4">
      <Header>My Wishlist</Header>
      <div className="w-full px-8 py-6">
        <WishlistRow />
      </div>
    </div>
  );
}
