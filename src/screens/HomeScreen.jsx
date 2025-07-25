import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import RandomQuote from "@/components/RandomQuote";
import SEOHead from "@/components/SEOHead";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useEffect, useState, useMemo } from "react";
import PostGrid from "@/components/PostGrid";
import { useSelector } from "react-redux";



const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const sectionId = location.state.scrollTo;
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
      
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);
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

  // Mémoriser les posts pour éviter les re-renders inutiles
  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
      return dateB - dateA;
    });
  }, [posts]);

  return (
    <>
      <SEOHead 
        title="Accueil"
        description="Découvrez une collection de poèmes et textes littéraires partagés par notre communauté. Créez et partagez vos propres étreintes éphémères."
        keywords="poésie, textes, littérature, partage, communauté, inspiration, écriture créative"
      />
      <div className="bg-[#E2DFD7]/70 lg:pb-11 pb-0">
        <Hero />
        <AboutSection />
        <PostGrid posts={sortedPosts} onLike={handleLike} userInfo={userInfo} />
        <RandomQuote />
      </div>
    </>
  );
};

export default HomeScreen;
