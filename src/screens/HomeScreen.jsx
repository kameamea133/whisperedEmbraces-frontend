import Hero from "@/components/Hero"
import { useGetPostsQuery } from "@/slices/postsApiSlice"
import PostGrid from "@/components/PostGrid";
import AboutSection from "@/components/AboutSection";
const HomeScreen = () => {
  const { data: posts } = useGetPostsQuery();
 
  return (
    <div className="bg-[#E2DFD7]/70">
      <Hero />
      <AboutSection />
      <PostGrid posts={posts} />
    </div>
  )
}

export default HomeScreen