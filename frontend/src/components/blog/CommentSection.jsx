import { useState, useEffect } from 'react';
import { Loading, EmptyState } from '../common';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import blogService from '../../services/blogService';
import toast from 'react-hot-toast';

const CommentSection = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    try {
      const response = await blogService.getComments(blogId);
      setComments(response.data.comments);
    } catch (error) {
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (commentData) => {
    try {
      await blogService.addComment(blogId, commentData);
      await fetchComments();
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Failed to add comment');
      throw error;
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await blogService.deleteComment(blogId, commentId);
      await fetchComments();
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  if (loading) {
    return <Loading.Skeleton count={3} />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Comments ({comments.length})
      </h2>

      <CommentForm blogId={blogId} onSubmit={handleAddComment} />

      {comments.length === 0 ? (
        <EmptyState
          title="No comments yet"
          description="Be the first to share your thoughts!"
        />
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onReply={handleAddComment}
              onDelete={handleDeleteComment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;