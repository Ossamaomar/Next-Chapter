
import { AiTwotoneMail } from "react-icons/ai";

export default function page() {
  return (
    <div className="px-8 my-10">
      <div
        className="w-full max-w-[600px] rounded-2xl h-[200px] 
                      flex flex-col justify-center items-center mx-auto 
                      bg-gray-50 shadow-2xl shadow-slate-300 border border-slate-500"
      >
        <div>
          <AiTwotoneMail className="text-emerald-600" size={50} />
        </div>
        <p className="text-xl text-slate-600">
          Check your email to verify your account
        </p>
      </div>
    </div>
  );
}
