import { getSiteContent } from "@/lib/contentStore";
import WhyUsPageClient from "@/components/views/WhyUsPageClient";

export default async function WhyUsPage() {
  const content = await getSiteContent();
  return <WhyUsPageClient content={content} />;
}
