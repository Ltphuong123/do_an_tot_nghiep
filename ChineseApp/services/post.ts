import { IMeta, IResponseSuccess } from "@/types/common.type";
import {
  IComment,
  ICommunityLeaderboard,
  IListUserLikeOrView,
  IPost,
} from "@/types/post.type";
import axios from "./index";

export const getCommunityLeaderboard = async (): Promise<
  IResponseSuccess<ICommunityLeaderboard[]>
> => {
  const res = await axios.get("/users/community-leaderboard", {
    requireAuth: true,
  });
  return res.data;
};

export const getPostList = async (
  topic?: string,
  page?: number,
  limit?: number,
  search?: string
): Promise<{ data: IPost[]; meta: IMeta }> => {
  const url = `/community/posts`;
  console.log("fetching posts from URL:");
  const res = await axios.get(url, {
    requireAuth: true,
    params: {
      page,
      limit,
      search,
      ...(topic !== undefined ? { topic } : undefined),
    },
  });
  console.log("Fetched posts response:", res.data);
  return res.data;
};

export const getPostDetail = async (postId: string): Promise<IPost> => {
  const res = await axios.get(`/community/posts/${postId}`, {
    requireAuth: true,
  });
  return res.data;
};

export const getPostById = async (
  postId: string
): Promise<IResponseSuccess<IPost>> => {
  const res = await axios.get(`/community/posts/${postId}`, {
    requireAuth: true,
  });
  return res.data;
};

export const getCommentsByPostId = async (postId: string) => {
  const res = await axios.get(`/community/posts/${postId}/comments`, {
    requireAuth: true,
  });
  return res.data;
};

export const commentsPost = async (
  post_id: string,
  content: string,
  parentCommentId: string | null
): Promise<IResponseSuccess<IComment>> => {
  const res = await axios.post(
    `/community/posts/${post_id}/comments`,
    {
      content,
      parentCommentId,
    },
    { requireAuth: true }
  );
  return res.data;
};

export const likePost = async (
  postId: string
): Promise<IResponseSuccess<{ action: string; likes: number }>> => {
  const res = await axios.post(
    `/community/posts/${postId}/like`,
    {},
    { requireAuth: true }
  );
  return res.data;
};

export const viewPost = async (
  postId: string
): Promise<IResponseSuccess<null>> => {
  const res = await axios.post(
    `/community/posts/${postId}/view`,
    {},
    { requireAuth: true }
  );
  return res.data;
};

export const createPost = async (
  title: string,
  topic: string,
  html: string,
  images: string[]
): Promise<IResponseSuccess<IPost>> => {
  console.log(
    "Creating post with title:",
    title,
    "topic:",
    topic,
    "images:",
    images,
    "html:",
    html
  );
  const res = await axios.post(
    "/community/posts",
    {
      title,
      topic,
      content: {
        html,
        images,
      },
    },
    { requireAuth: true }
  );
  console.log("Created post response:", res);
  return res.data;
};

export const editPost = async (
  postId: string,
  title: string,
  topic: string,
  html: string,
  images: string[]
): Promise<IResponseSuccess<IPost>> => {
  const res = await axios.put(
    `/community/posts/${postId}`,
    {
      title,
      topic,
      content: {
        html,
        images,
      },
    },
    { requireAuth: true }
  );
  return res.data;
};

export const deletePost = async (
  postId: string
): Promise<IResponseSuccess<null>> => {
  console.log("Deleting post with ID:", postId);
  const res = await axios.delete(`/community/posts/${postId}`, {
    requireAuth: true,
    data: { reason: "" },
  });
  return res.data;
};

export const editComment = async (commnetId: string, content: string) => {
  const res = await axios.put(
    `/community/comments/${commnetId}`,
    { content },
    { requireAuth: true }
  );
  return res.data;
};

export const getMyPosts = async (
  page?: number,
  limit?: number
): Promise<{ success: boolean; data: IPost[]; meta: IMeta }> => {
  const res = await axios.get("/users/me/posts", {
    requireAuth: true,
    params: { page, limit },
  });
  return res.data;
};

export const getInteractedPosts = async (
  page?: number,
  limit?: number
): Promise<{ success: boolean; data: IPost[]; meta: IMeta }> => {
  const res = await axios.get("/users/me/interacted-posts", {
    requireAuth: true,
    params: { page, limit },
  });
  return res.data;
};

export const getUserLikedOrLikePosts = async (
  postID: string,
  page?: number,
  limit?: number,
  type: "likes" | "views" = "likes"
): Promise<IResponseSuccess<{ data: IListUserLikeOrView[]; meta: IMeta }>> => {
  const res = await axios.get(`community/posts/${postID}/${type}`, {
    requireAuth: true,
    params: { page, limit },
  });
  return res.data;
};

export const getPostUserViewed = async (
  postID: string,
  page?: number,
  limit?: number
): Promise<{ data: IPost[]; meta: IMeta; success: boolean }> => {
  const res = await axios.get(`community/users/${postID}/viewed-posts`, {
    requireAuth: true,
    params: { page, limit },
  });
  return res.data;
};

export const getPostUserLiked = async (
  postID: string,
  page?: number,
  limit?: number
): Promise<{ data: IPost[]; meta: IMeta; success: boolean }> => {
  const res = await axios.get(`community/users/${postID}/liked-posts`, {
    requireAuth: true,
    params: { page, limit },
  });
  return res.data;
};

export const getViewedPosts = async (
  page?: number,
  limit?: number
): Promise<{ data: IPost[]; meta: IMeta }> => {
  const res = await axios.get("/users/me/viewed-posts", {
    requireAuth: true,
    params: { page, limit },
  });
  return res.data;
};

export const getLikedPosts = async (
  page?: number,
  limit?: number
): Promise<{ data: IPost[]; meta: IMeta }> => {
  const res = await axios.get("/users/me/liked-posts", {
    requireAuth: true,
    params: { page, limit },
  });
  return res.data;
};
