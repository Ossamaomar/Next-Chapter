import WishlistContainer from "../_components/wishlist/WishlistContainer";
import WishlistHeader from "../_components/wishlist/WishlistHeader";


export default function page() {
  return (
    <div className="space-y-4">
      <WishlistHeader />      
      <WishlistContainer />
    </div>
  );
}
