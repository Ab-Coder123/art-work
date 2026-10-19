import { getSiteContent } from "@/lib/contentStore";
import HomePageClient from "@/components/views/HomePageClient";

export default async function HomePage() {
  const content = await getSiteContent();
  return <HomePageClient content={content} />;
}
