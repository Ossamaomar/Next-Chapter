
import { AiOutlineSend } from "react-icons/ai";

function Footer() {
  return (
    <footer className="bg-black h-auto w-full p-10">
      <div className="flex flex-col gap-8 md:flex-row md:justify-between ">
        <div className="">
          <h3 className="text-white text-2xl font-semibold mb-5">Exclusive</h3>
          <h4 className="text-white text-xl font-medium mb-5">Subscribe</h4>
          <p className="text-white text-lg font-normal mb-5">
            Get 10% off your first order
          </p>
          <div className="flex justify-between items-center border border-white rounded-lg px-2 py-3">
            <input
              className="bg-transparent focus:ring-0 focus:outline-none  text-white  "
              type="email"
              placeholder="email"
            />
            <AiOutlineSend className="cursor-pointer" color="#fff" size={25} />
          </div>
        </div>

        <div>
          <h3 className="text-white text-2xl font-semibold mb-5">Support</h3>
          <p className="text-white text-lg font-normal mb-5">
            111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.
          </p>
          <p className="text-white text-lg font-normal mb-5">
            exclusive@gmail.com
          </p>
          <p className="text-white text-lg font-normal mb-5">
            +88015-88888-9999
          </p>
        </div>

        <div>
          <h3 className="text-white text-2xl font-semibold mb-5">Account</h3>
          <p className="text-white text-lg font-normal mb-5">My account</p>
          <p className="text-white text-lg font-normal mb-5">
            Login / Register
          </p>
          <p className="text-white text-lg font-normal mb-5">Cart</p>

          <p className="text-white text-lg font-normal mb-5">Wishlist</p>
        </div>

        <div>
          <h3 className="text-white text-2xl font-semibold mb-5">Quick Links</h3>
          <p className="text-white text-lg font-normal mb-5">Privacy Policy</p>
          <p className="text-white text-lg font-normal mb-5">Terms Of Use</p>
          <p className="text-white text-lg font-normal mb-5">FAQ</p>

          <p className="text-white text-lg font-normal mb-5">Contact</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
