import ShowTredingTattos from "@/components/home/ShowTredingTattos";
import Hero from "../../components/common/Hero";
import ShowTopArtist from "../../components/home/ShowTopArtist";
import RecentActivity from "@/components/home/RecentActivity";

export default function Home() {
  const title = 'Find Your Artist & Share Your Story.'
  return (
    <div className="flex flex-col p-4">
     <Hero title={title} />
     <ShowTopArtist />
     <ShowTredingTattos />
     <RecentActivity />
    </div>
  );
}
