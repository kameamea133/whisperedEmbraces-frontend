import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import { useLocation } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useEffect, useState } from "react";
import PostGrid from "@/components/PostGrid";


const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollToAbout) {
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
    } else if (location.state?.scrollToEtreintes) {
      document.getElementById("etreintes-section")?.scrollIntoView({ behavior: "smooth" });
    }


  }, [location]);
  const fetchPosts = async () => {
    const postsCollection = collection(db, "posts");
    const postsSnapshot = await getDocs(postsCollection);
    const postsList = postsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPosts(postsList); 
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="bg-[#E2DFD7]/70">
      <Hero />
      <AboutSection />
      <PostGrid posts={posts} />
    </div>
  );
};

export default HomeScreen;
