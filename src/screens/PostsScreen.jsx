import PostCreateForm from "../components/PostCreateForm";
import PostsList from "../components/PostsList";

const PostsScreen = () => {
  return (
    <div className="w-[50%] mx-auto p-6 pt-[200px]">
      <h1 className="text-3xl font-bold mb-6 font-lora text-center my-5">Mes étreintes</h1>
      <PostCreateForm />
      <PostsList />
    </div>
  );
};

export default PostsScreen;
