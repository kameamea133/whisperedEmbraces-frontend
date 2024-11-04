import { useState } from "react";
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
    <div className="font-lora space-y-6">
      {posts.map((post) => (
        <div key={post._id} className="bg-white rounded-md shadow-md p-4 mb-6 md:mb-4">
          {editMode === post._id ? (
            <div className="space-y-4">
              {post.headerImage && (
                <img
                  src={post.headerImage}
                  alt={post.title}
                  className="w-full h-48 object-cover mb-4 rounded-md"
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
                <Button onClick={() => handleUpdate(post._id)}>Enregistrer</Button>
                <Button onClick={() => setEditMode(null)} variant="secondary">
                  Annuler
                </Button>
              </div>
            </div>
          ) : (
            <div>
              {post.headerImage && (
                <img
                  src={post.headerImage}
                  alt={post.title}
                  className="w-full h-48 object-cover mb-4 rounded-md"
                />
              )}
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <div dangerouslySetInnerHTML={{ __html: post.content }} className="text-base" />
              <div className="flex flex-wrap space-x-2 mt-4">
                <Button onClick={() => handleEdit(post)}>Modifier</Button>
                <Button onClick={() => handleDelete(post._id)} variant="destructive">
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
