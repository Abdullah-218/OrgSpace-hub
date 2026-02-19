import { useState } from 'react';
import { Button } from '../common';
import { formatNumber } from '../../utils/helpers';

const LikeButton = ({ blogId, initialLiked = false, initialCount = 0, onLike, size = 'md' }) => {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleLike = async (e) => {
    e.stopPropagation();
    
    setLoading(true);
    const newLiked = !liked;
    const newCount = newLiked ? count + 1 : count - 1;
    
    setLiked(newLiked);
    setCount(newCount);

    try {
      if (onLike) {
        await onLike(blogId, newLiked);
      }
    } catch (error) {
      setLiked(!newLiked);
      setCount(count);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={liked ? 'primary' : 'outline'}
      size={size}
      onClick={handleLike}
      disabled={loading}
      className="transition-all duration-200"
    >
      <svg
        className={`w-5 h-5 ${size === 'sm' ? 'w-4 h-4' : ''} ${size === 'lg' ? 'w-6 h-6' : ''} mr-1`}
        fill={liked ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {formatNumber(count)}
    </Button>
  );
};

export default LikeButton;