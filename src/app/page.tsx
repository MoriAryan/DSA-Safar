import CourseSheet from "@/components/CourseSheet";
import { LandingPage } from "@/components/LandingPage";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();
  
  if (!userId) {
    return <LandingPage />;
  }

  return <CourseSheet />;
}
