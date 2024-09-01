import { useEffect, useState } from "react";
import "./App.css";
import AddPost from "./components/AddPost.jsx";
import EditPost from "./components/EditPost.jsx";
import Posts from "./components/Posts";
import api from "./api/api.js";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState(null); // post I am editing
  const [error, setError] = useState(null);

  const handleAddPost = async (newPost) => {
    try {
      const id = posts.length ? Number(posts[posts.length - 1].id) + 1 : 1;

      const final = {
        id: id.toString(),
        ...newPost,
      };

      const response = await api.post("/posts", final);
      setPosts([...posts, response.data]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeletePost = async (postId) => {
    if (confirm("are you sure ")) {
      try {
        await api.delete(`/posts/${postId}`);
        const postDelete = posts.filter((pos) => pos.id !== postId);

        // Serial maintain করার জন্য নতুন করে id assign করছি
        const reindexedPosts = postDelete.map((post, index) => {
          console.log(post); // প্রতিটি post object-টি console-এ প্রদর্শিত হবে
          return {
            ...post,
            id: (index + 1).toString(),
          };
        });

        setPosts(reindexedPosts);
        // await api.delete(`/posts/${postId}`);
        // const postDelete = posts.filter((pos) => pos.id !== postId);
        // setPosts(postDelete);
      } catch (err) {
        setError(err);
      }
    } else {
      console.log("not delete post");
    }
  };

  const handleEditPost = async (updatedPost) => {
    try {
      await api.patch(`/posts/${updatedPost.id}`, updatedPost);
      const update = posts.map((pos) =>
        pos.id === updatedPost.id ? updatedPost : pos
      );
      setPosts(update);
      setPost(null);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/posts");
        if (response && response.data) {
          setPosts(response.data);
        }
      } catch (err) {
        console.log(err);
        setError(err.message);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold">API Request with Axios</h1>
        <hr />

        <div>
          <Posts
            posts={posts}
            onDeletePost={handleDeletePost}
            onEditClick={setPost}
          />

          <hr />

          {!post ? (
            <AddPost onAddPost={handleAddPost} />
          ) : (
            <EditPost post={post} onEditPost={handleEditPost} />
          )}

          {error && (
            <>
              <hr />
              <div className="error">{error}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
