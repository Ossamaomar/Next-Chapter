import { Category as CategoryType } from "@/app/_services/types";
import { useRouter } from "next/navigation";
import {
  FaBriefcase,
  FaBullhorn,
  FaCode,
  FaMoneyBillTrendUp,
  FaSeedling,
} from "react-icons/fa6";
import { IoFitness } from "react-icons/io5";
import { MdBrush } from "react-icons/md";
import { TbNetwork } from "react-icons/tb";

const icons = [
  { name: "Health & Fitness", icon: <IoFitness size={30} /> },
  { name: "Business", icon: <FaBriefcase size={30} /> },
  { name: "Design", icon: <MdBrush size={30} /> },
  { name: "Personal Development", icon: <FaSeedling size={30} /> },
  { name: "IT & Software", icon: <TbNetwork size={30} /> },
  { name: "Development", icon: <FaCode size={30} /> },
  { name: "Finance & Accounting", icon: <FaMoneyBillTrendUp size={30} /> },
  { name: "Marketing", icon: <FaBullhorn size={30} /> },
];

export default function Category({ category }: { category: CategoryType }) {
  const router = useRouter();
  return (
    <div
      className="p-10 w-[250px] h-50 flex flex-col justify-center items-center gap-3 rounded-xl
                 transition duration-500 hover:bg-gradient-to-tr border-2  hover:scale-125 cursor-pointer"
      onClick={() => router.push(`/category/${category.name}`)}
    >
      <div className="text-emerald-500  border-2 border-slate-700 p-4 rounded-full">
        {icons.find((icon) => icon.name === category.name).icon}
      </div>
      <p className="text-center">{category.name}</p>
    </div>
  );
}
