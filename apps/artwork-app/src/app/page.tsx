import { getInitialHomeData } from "@/components/home/server";
import { HomeTheaterController } from "@/components/home/HomeTheaterController";

export const revalidate = 60;

export default async function Home() {
  const initialData = await getInitialHomeData();

  return <HomeTheaterController initialData={initialData} />;
}
