import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import { doc, collection, getDocs, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useEffect } from "react";

const HomeScreen = () => {
  // const { data: posts } = useGetPostsQuery();

  
  const docRef = doc(db, "users", "WJyo7GRElpckPTsbcavf");

  
  const fetchTestData = async () => {
    const querySnapshot = await getDocs(collection(db, "test"));
    querySnapshot.forEach((doc) => {
      console.log("Document récupéré :", doc.id, "=>", doc.data());
    });
  };

 
  const fetchData = async () => {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data trouvé");
    } else {
      console.log("Aucun document trouvé !");
    }
  };

  useEffect(() => {
    fetchData();
    fetchTestData();
  }, []);

  return (
    <div className="bg-[#E2DFD7]/70">
      <Hero />
      <AboutSection />
      {/* <PostGrid posts={posts} /> */}
    </div>
  );
};

export default HomeScreen;
