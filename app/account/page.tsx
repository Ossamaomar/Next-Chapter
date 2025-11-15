import AccountContainer from "../_components/account/AccountContainer";
import AccountHeader from "../_components/account/AccountHeader";

export default function page() {
  return (
    <div className="space-y-4">
      <AccountHeader />
      <div className="w-full py-12 px-8">
        <AccountContainer />
      </div>
    </div>
  );
}
