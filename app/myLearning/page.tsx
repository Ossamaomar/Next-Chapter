import Header from "../_components/myLearning/Header";
import MyLearningCoursesRow from "../_components/myLearning/MyLearningCoursesRow";

export default function page() {
  return (
    <div className="space-y-4">
      <Header />
      <div className="w-full px-8 py-6">
        <MyLearningCoursesRow />
      </div>
    </div>
  );
}
