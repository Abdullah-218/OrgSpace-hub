import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

const blogService = {
  // Get all blogs with filters
  getBlogs: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.BLOGS.BASE, { params });
    return response.data;
  },

  // Get trending blogs
  getTrendingBlogs: async (limit = 10) => {
    const response = await api.get(API_ENDPOINTS.BLOGS.TRENDING, {
      params: { limit },
    });
    return response.data;
  },

  // Get blog by ID
  getBlogById: async (id) => {
    const response = await api.get(API_ENDPOINTS.BLOGS.BY_ID(id));
    return response.data;
  },

  // Create blog
  createBlog: async (blogData) => {
    const response = await api.post(API_ENDPOINTS.BLOGS.BASE, blogData);
    return response.data;
  },

  // Update blog
  updateBlog: async (id, blogData) => {
    const response = await api.patch(API_ENDPOINTS.BLOGS.BY_ID(id), blogData);
    return response.data;
  },

  // Delete blog
  deleteBlog: async (id) => {
    const response = await api.delete(API_ENDPOINTS.BLOGS.BY_ID(id));
    return response.data;
  },

  // Get my blogs
  getMyBlogs: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.BLOGS.MY_BLOGS, { params });
    return response.data;
  },

  // Get blog comments
  getBlogComments: async (blogId, params = {}) => {
    const response = await api.get(API_ENDPOINTS.COMMENTS.BY_BLOG(blogId), { params });
    return response.data;
  },

  // Add comment
  addComment: async (blogId, commentData) => {
    const response = await api.post(API_ENDPOINTS.COMMENTS.BY_BLOG(blogId), commentData);
    return response.data;
  },

  // Update comment
  updateComment: async (commentId, commentData) => {
    const response = await api.patch(API_ENDPOINTS.COMMENTS.BY_ID(commentId), commentData);
    return response.data;
  },

  // Delete comment
  deleteComment: async (commentId) => {
    const response = await api.delete(API_ENDPOINTS.COMMENTS.BY_ID(commentId));
    return response.data;
  },

  // Toggle like
  toggleLike: async (blogId) => {
    const response = await api.post(API_ENDPOINTS.LIKES.TOGGLE(blogId));
    return response.data;
  },

  // Get like info
  getLikeInfo: async (blogId) => {
    const response = await api.get(API_ENDPOINTS.LIKES.INFO(blogId));
    return response.data;
  },
};

export default blogService;