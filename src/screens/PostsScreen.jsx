import PostCreateForm from "../components/PostCreateForm";
import PostsList from "../components/PostsList";

const PostsScreen = () => {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 pt-20 md:pt-[150px] lg:pt-[200px] overflow-y-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 font-lora text-center my-3 sm:my-5">Mes étreintes</h1>
      <PostCreateForm />
      <PostsList />
    </div>
  );
};

export default PostsScreen;
