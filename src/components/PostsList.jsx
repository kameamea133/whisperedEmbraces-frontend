import { useState, useEffect } from "react";
import { db } from "@/firebaseConfig";
import { collection, getDocs, getDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import ReactQuill from "react-quill";

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImage, setEditImage] = useState(null);

  const userInfo = useSelector((state) => state.auth.userInfo);

  useEffect(() => {
    const fetchPosts = async () => {
      const postsCollection = collection(db, "posts");
      const postsSnapshot = await getDocs(postsCollection);
      const postsList = postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((post) => post.authorId === userInfo?.uid);
      setPosts(postsList);
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "posts", id));
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
  };

  const handleEdit = (post) => {
    setEditMode(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditImage(null); 
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my_preset"); 

    const response = await fetch(`https://api.cloudinary.com/v1_1/dhp8teilh/image/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return data;
  };

  const handleDeleteOldImage = async (publicId) => {
    await fetch(`https://api.cloudinary.com/v1_1/dhp8teilh/image/destroy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ public_id: publicId }),
    });
  };

  const handleUpdate = async (id) => {
    const postRef = doc(db, "posts", id);
    const postSnapshot = await getDoc(postRef);
  
    if (postSnapshot.exists()) {
      const postData = postSnapshot.data();
  
      let imageUrl = postData.imageUrl;
      let publicId = postData.publicId;
  
      if (editImage) {
        if (publicId) {
          await handleDeleteOldImage(publicId);
        }
  
        const uploadedImage = await handleImageUpload(editImage);
        imageUrl = uploadedImage.secure_url;
        publicId = uploadedImage.public_id;
      }
  
      
      const updatedData = {
        title: editTitle,
        content: editContent,
        ...(imageUrl && { imageUrl }), 
        ...(publicId && { publicId })  
      };
  
      try {
        await updateDoc(postRef, updatedData);
  
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === id ? { ...post, ...updatedData } : post
          )
        );
        setEditMode(null);
      } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
      }
    } else {
      console.error("Le document n'existe pas.");
    }
  };
  
  
  return (
    <div className="font-lora w-[70%] space-y-6 mx-auto min-h-[400px]">
      {posts.map((post) => (
        <div key={post.id} className="bg-white h-full rounded-md shadow-md p-4 mb-6 md:mb-4">
          {editMode === post.id ? (
            <div className="h-full flex flex-col justify-around gap-4">
              {post.imageUrl && (
                <img
                  src={post.imageUrl} 
                  alt={post.title}
                  className="h-[40%] object-cover mb-4 rounded-md"
                />
              )}
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="block w-full border rounded px-3 py-2"
              />
              <ReactQuill value={editContent} onChange={setEditContent} />
              <input
                type="file"
                onChange={(e) => setEditImage(e.target.files[0])}
                className="block w-full mt-2"
              />
              <div className="flex space-x-2 mt-4">
                <Button onClick={() => handleUpdate(post.id)}>Enregistrer</Button>
                <Button onClick={() => setEditMode(null)} variant="secondary">
                  Annuler
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-around gap-4">
              {post.imageUrl && (
                <img
                  src={post.imageUrl} 
                  alt={post.title}
                  className=" h-[40%] object-cover mb-4 rounded-md"
                />
              )}
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <div dangerouslySetInnerHTML={{ __html: post.content }} className="text-base" />
              <div className="flex space-x-2 mt-4 w-full">
                <Button onClick={() => handleEdit(post)}>Modifier</Button>
                <Button onClick={() => handleDelete(post.id)} variant="destructive">
                  Supprimer
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PostsList;
