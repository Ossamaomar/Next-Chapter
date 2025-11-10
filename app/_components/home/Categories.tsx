import { getCoursesCategories } from "@/app/_services/categories";
import { Category as CategoryType } from "@/app/_services/types";
import CategoriesContainer from "./CategoriesContainer";

export default async function Categories() {
  const categories: CategoryType[] = await getCoursesCategories();
  return (
    <div className="py-20">
      <CategoriesContainer categories={categories} />
    </div>
  );
}
