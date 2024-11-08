import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import { useLocation } from "react-router-dom";
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useEffect, useState } from "react";
import PostGrid from "@/components/PostGrid";
import { useSelector } from "react-redux";


const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const userInfo = useSelector((state) => state.auth.userInfo);
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

  const handleLike = async (postId) => {
    if (!userInfo) {
      alert("Vous devez être connecté pour aimer un texte.");
      return;
    }

    const postRef = doc(db, "posts", postId);
    const post = posts.find((p) => p.id === postId);
    const likedByUser = post.likes?.includes(userInfo.uid);

    try {
      await updateDoc(postRef, {
        likes: likedByUser
          ? arrayRemove(userInfo.uid)
          : arrayUnion(userInfo.uid),
      });

      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId
            ? { ...p, likes: likedByUser ? p.likes.filter((uid) => uid !== userInfo.uid) : [...(p.likes || []), userInfo.uid] }
            : p
        )
      );
    } catch (error) {
      console.error("Erreur lors de l'ajout/suppression du like :", error);
    }
  };


  return (
    <div className="bg-[#E2DFD7]/70 pb-11 lg:pb-0">
      <Hero />
      <AboutSection />
      <PostGrid posts={posts} onLike={handleLike} userInfo={userInfo} />
    </div>
  );
};

export default HomeScreen;
