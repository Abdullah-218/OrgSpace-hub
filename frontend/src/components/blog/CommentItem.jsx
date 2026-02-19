import { useState } from 'react';
import { Avatar, Button } from '../common';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/helpers';
import CommentForm from './CommentForm';

const CommentItem = ({ comment, onReply, onDelete, level = 0 }) => {
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const maxLevel = 3;

  const handleReplySubmit = async (replyData) => {
    await onReply(replyData);
    setShowReplyForm(false);
  };

  const isAuthor = user?._id === comment.userId?._id;

  return (
    <div className={`${level > 0 ? 'ml-8 mt-4' : ''}`}>
      <div className="flex gap-3">
        <Avatar
          src={comment.userId?.avatar}
          name={comment.userId?.name}
          size="sm"
        />

        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-gray-900 text-sm">
                {comment.userId?.name}
              </span>
              <span className="text-xs text-gray-500">
                {formatDate(comment.createdAt, 'relative')}
              </span>
            </div>
            <p className="text-gray-700 text-sm">{comment.content}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
            {level < maxLevel && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="hover:text-primary-600"
              >
                Reply
              </button>
            )}
            {isAuthor && (
              <button
                onClick={() => onDelete(comment._id)}
                className="hover:text-red-600"
              >
                Delete
              </button>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-3">
              <CommentForm
                blogId={comment.blogId}
                parentId={comment._id}
                onSubmit={handleReplySubmit}
                onCancel={() => setShowReplyForm(false)}
                placeholder={`Reply to ${comment.userId?.name}...`}
              />
            </div>
          )}

          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  onReply={onReply}
                  onDelete={onDelete}
                  level={level + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
