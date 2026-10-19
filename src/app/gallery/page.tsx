import { getProjects } from "@/lib/contentStore";
import GalleryPageClient from "@/components/views/GalleryPageClient";

export default async function GalleryPage() {
  const projects = await getProjects({ status: "published" });
  return <GalleryPageClient initialProjects={projects} />;
}
