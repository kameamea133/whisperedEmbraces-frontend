import  { useState } from "react";
import { useGetPostsQuery, useDeletePostMutation, useUpdatePostMutation } from "../slices/postsApiSlice";
import { Button } from "./ui/button";
import ReactQuill from "react-quill";

const PostsList = () => {
  const { data: posts, isLoading, isError, error } = useGetPostsQuery();
  const [deletePost] = useDeletePostMutation();
  const [updatePost] = useUpdatePostMutation();
  const [editMode, setEditMode] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImage, setEditImage] = useState(null);
  const handleDelete = async (id) => {
    await deletePost(id);
  };

  const handleEdit = (post) => {
    setEditMode(post._id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  

  const handleUpdate = async (id) => {
    const formData = new FormData();
    formData.append("title", editTitle);
    formData.append("content", editContent);
    if (editImage) {
      formData.append("headerImage", editImage);
    }
    try {
      await updatePost({ id, formData }).unwrap();
      setEditMode(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  if (isLoading) return <p>Chargement des textes...</p>;
  if (isError) return <p>Erreur : {error.message}</p>;

  return (
    <div className="font-lora">
      {posts.map((post) => (
        <div key={post._id} className="  bg-gray-100 rounded shadow mb-4">
          {editMode === post._id ? (
            <div className="p-4 bg-[url('/paperBg3.png')] bg-cover bg-no-repeat bg-center  rounded-md shadow-lg">
            <div className="w-[500px] h-[300px]">
            <img  src={post.headerImage} alt={post.title} className="w-full h-full object-cover mb-4"/>
            </div>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="block w-full border rounded px-3 py-2 my-4"
              />
               <ReactQuill
                value={editContent}
                onChange={setEditContent}
                className="mb-2"
              />
              <input
                type="file"
                onChange={(e) => setEditImage(e.target.files[0])}
                className="block w-full border rounded px-3 py-2 mb-2"
              />
              <Button onClick={() => handleUpdate(post._id)}>Enregistrer</Button>
              <Button onClick={() => setEditMode(null)} className="ml-2">Annuler</Button>
            </div>
          ) : (
            <div className="bg-[url('/paperBg3.png')] bg-cover bg-no-repeat bg-center p-4 rounded-md shadow-lg">
            <div className="w-[500px] h-[300px] mb-5">
              <img  src={post.headerImage} alt={post.title} className="w-full h-full object-cover"/>
            </div>
              <h3 className="text-2xl font-semibold my-4">{post.title}</h3>
              <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
              <div className="flex space-x-2 mt-2">
                <Button onClick={() => handleEdit(post)} variant="outline">Modifier</Button>
                <Button onClick={() => handleDelete(post._id)} variant="destructive">Supprimer</Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PostsList;
