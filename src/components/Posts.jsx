export default function Posts({ posts, onDeletePost, onEditClick }) {
  return (
    <div>
      <h2 className="text-2xl font-bold">All Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <span>{post.id}</span>
            <span>{post.title}</span>
            <div>
              <span onClick={() => onDeletePost(post.id)}>❌</span>
              <span onClick={() => onEditClick(post)}>✏️</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
