import Categories from "./_components/home/Categories";
import Instructor from "./_components/home/Instructor";
import Main from "./_components/home/Main";


export default async function Home() {
  
  return (
    <div className="bg-stone-50 flex flex-col flex-1">
      <Main />
      <Categories />
      <Instructor />
    </div>
  );
}
