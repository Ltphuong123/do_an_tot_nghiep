import {
  createPost,
  deletePost,
  editPost,
  getCommentsByPostId,
  getCommunityLeaderboard,
  getInteractedPosts,
  getMyPosts,
  getPostById,
  getPostList,
  getPostUserLiked,
  getPostUserViewed,
  getUserLikedOrLikePosts,
  likePost,
  viewPost,
} from "@/services/post";
import { useUserStore } from "@/store/useUserStore";
import { IMeta } from "@/types/common.type";
import { IComment, IPost } from "@/types/post.type";
import {
  QueryClient,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { DeviceEventEmitter } from "react-native";

// Query keys
export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (filters: {
    topic?: string;
    page?: number;
    limit?: number;
    search?: string;
  }) => [...postKeys.lists(), filters] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
  comments: (id: string) => [...postKeys.all, "comments", id] as const,
  myPosts: (filters: { page?: number; limit?: number }) =>
    [...postKeys.all, "myPosts", filters] as const,
  interactedPosts: (filters: { page?: number; limit?: number }) =>
    [...postKeys.all, "interactedPosts", filters] as const,
  viewedPosts: (filters: { page?: number; limit?: number }) =>
    [...postKeys.all, "viewed", filters] as const,
  likedPosts: (filters: { page?: number; limit?: number }) =>
    [...postKeys.all, "liked", filters] as const,
  leaderboard: () => [...postKeys.all, "leaderboard"] as const,
  userInteractions: (
    postId: string,
    type: "likes" | "views",
    filters: { page?: number; limit?: number }
  ) => [...postKeys.all, "userInteractions", postId, type, filters] as const,
};

// ========== FETCH POST LIST ==========
export function usePostList(
  topic: string = "",
  page: number = 1,
  limit: number = 10,
  search?: string,
  options: any = {}
) {
  console.log(
    "usePostList called with topic:",
    topic,
    "page:",
    page,
    "limit:",
    limit
  );
  return useQuery<{ data: IPost[]; meta: IMeta }>({
    ...options,
    queryKey: postKeys.list({ topic, page, limit, search }),
    queryFn: async () => {
      console.log("Fetching posts for page", page, "topic", topic);
      const response = await getPostList(topic, page, limit, search);
      console.log("Fetched posts:", response.data?.length);
      return response;
    },
  });
}

// ========== FETCH POST DETAIL ==========
export function usePostDetail(postId: string, initialData?: IPost) {
  return useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: async () => {
      const response = await getPostById(postId);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch post");
      }
      return response.data;
    },
    initialData,
    enabled: !!postId,
  });
}

export function usePostComments(postId: string) {
  return useQuery({
    queryKey: postKeys.comments(postId),
    queryFn: async () => {
      const response = await getCommentsByPostId(postId);
      return (response.data || []) as IComment[];
    },
    enabled: !!postId,
  });
}

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await likePost(postId);
      return { postId, ...response };
    },
    // Optimistic update
    onMutate: async (postId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: postKeys.detail(postId) });

      // Snapshot the previous value
      const previousPost = queryClient.getQueryData<IPost>(
        postKeys.detail(postId)
      );

      // Optimistically update detail
      if (previousPost) {
        const newIsLiked = !previousPost.isLiked;
        const newLikes = newIsLiked
          ? (previousPost.likes || 0) + 1
          : (previousPost.likes || 0) - 1;

        queryClient.setQueryData<IPost>(postKeys.detail(postId), {
          ...previousPost,
          isLiked: newIsLiked,
          likes: newLikes,
        });
      }

      // Update all post list queries
      updatePostInAllLists(queryClient, postId, (post) => {
        const newIsLiked = !post.isLiked;
        const newLikes = newIsLiked
          ? (post.likes || 0) + 1
          : (post.likes || 0) - 1;

        return {
          ...post,
          isLiked: newIsLiked,
          likes: newLikes,
        };
      });

      return { previousPost };
    },
    // On success, update with server data
    onSuccess: (data, postId) => {
      if (data.success) {
        const serverLikes = data.data?.likes ?? 0;
        const serverIsLiked = data.data?.action === "liked";

        // Update detail cache
        queryClient.setQueryData<IPost>(postKeys.detail(postId), (old) => {
          if (!old) return old;
          return {
            ...old,
            isLiked: serverIsLiked,
            likes: serverLikes,
          };
        });

        // Update all lists
        updatePostInAllLists(queryClient, postId, (post) => ({
          ...post,
          isLiked: serverIsLiked,
          likes: serverLikes,
        }));

        // If unliked, remove from liked posts cache
        if (data.data?.action === "unliked") {
          queryClient.setQueryData(
            postKeys.likedPosts({ page: 1, limit: 30 }),
            (oldData: any) => {
              if (!oldData?.data) return oldData;
              return {
                ...oldData,
                data: oldData.data.filter((p: IPost) => p.id !== postId),
                meta: {
                  ...oldData.meta,
                  totalItems: oldData.meta.totalItems - 1,
                },
              };
            }
          );
          updateMetaInLikedPostsQueries(queryClient, true);
        }

        // Emit event for backward compatibility with DeviceEventEmitter listeners
        DeviceEventEmitter.emit("postLiked", {
          postId,
          likes: serverLikes,
          isLiked: serverIsLiked,
        });
      }
    },
    // On error, rollback
    onError: (err, postId, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(postKeys.detail(postId), context.previousPost);
      }
    },
  });
}

// ========== VIEW POST MUTATION ==========
export function useViewPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await viewPost(postId);
      return { postId, ...response };
    },
    onSuccess: (data, postId) => {
      if (data.success) {
        // Update view count in cache
        queryClient.setQueryData<IPost>(postKeys.detail(postId), (old) => {
          if (!old) return old;
          return {
            ...old,
            views: (old.views || 0) + 1,
            isViewed: true,
          };
        });

        // Update in all lists
        updatePostInAllLists(queryClient, postId, (post) => ({
          ...post,
          views: (post.views || 0) + 1,
          isViewed: true,
        }));
      }
    },
  });
}

// ========== HELPER: Update post in all list queries ==========
function updatePostInAllLists(
  queryClient: QueryClient,
  postId: string,
  updater: (post: IPost) => IPost
) {
  // Get all queries that match the list pattern
  const queries = queryClient.getQueriesData<{
    data: IPost[];
    meta: any;
  }>({
    queryKey: postKeys.lists(),
  });

  queries.forEach(([queryKey, queryData]) => {
    if (!queryData?.data) return;

    const updatedData = queryData.data.map((post) =>
      post.id === postId ? updater(post) : post
    );

    queryClient.setQueryData(queryKey, {
      ...queryData,
      data: updatedData,
    });
  });
}

// ========== HELPER: Update meta in all liked posts queries ==========
export function updateMetaInLikedPostsQueries(
  queryClient: QueryClient,
  decrement: boolean
) {
  const queries = queryClient.getQueriesData({
    queryKey: ["posts", "liked"],
  });

  queries.forEach(([queryKey, queryData]) => {
    const data = queryData as { data: IPost[]; meta: any } | undefined;
    if (data?.meta) {
      queryClient.setQueryData(queryKey, {
        ...data,
        meta: {
          ...data.meta,
          totalItems: decrement
            ? data.meta.totalItems - 1
            : data.meta.totalItems + 1,
        },
      });
    }
  });
}

// ========== HELPER: Update meta in all viewed posts queries ==========
export function updateMetaInViewedPostsQueries(
  queryClient: QueryClient,
  decrement: boolean
) {
  const queries = queryClient.getQueriesData({
    queryKey: ["posts", "viewed"],
  });

  queries.forEach(([queryKey, queryData]) => {
    const data = queryData as { data: IPost[]; meta: any } | undefined;
    if (data?.meta) {
      queryClient.setQueryData(queryKey, {
        ...data,
        meta: {
          ...data.meta,
          totalItems: decrement
            ? data.meta.totalItems - 1
            : data.meta.totalItems + 1,
        },
      });
    }
  });
}

// ========== UPDATE COMMENT COUNT ==========
export function useUpdateCommentCount() {
  const queryClient = useQueryClient();

  return (postId: string, newCount: number) => {
    // Update detail
    queryClient.setQueryData<IPost>(postKeys.detail(postId), (old) => {
      if (!old) return old;
      return {
        ...old,
        comment_count: newCount,
        isCommented: true,
      };
    });

    // Update all lists
    updatePostInAllLists(queryClient, postId, (post) => ({
      ...post,
      comment_count: newCount,
      isCommented: true,
    }));

    // Emit for backward compatibility
    DeviceEventEmitter.emit("postCommented", {
      postId,
      comments: newCount,
    });
  };
}

// ========== FETCH MY POSTS ==========
export function useMyPosts(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: postKeys.myPosts({ page, limit }),
    queryFn: async () => {
      const response = await getMyPosts(page, limit);
      return response;
    },
  });
}

// ========== FETCH INTERACTED POSTS ==========
export function useInteractedPosts(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: postKeys.interactedPosts({ page, limit }),
    queryFn: async () => {
      const response = await getInteractedPosts(page, limit);
      return response;
    },
  });
}

// ========== FETCH VIEWED POSTS ==========
export function useViewedPosts(
  page: number = 1,
  limit: number = 10,
  options: any = {}
) {
  const { user } = useUserStore();
  return useQuery({
    ...options,
    queryKey: postKeys.viewedPosts({ page, limit }),
    queryFn: async () => {
      if (!user?.id) throw new Error("User not found");
      const response = await getPostUserViewed(user.id, page, limit);
      return response;
    },
  });
}

// ========== FETCH LIKED POSTS ==========
export function useLikedPosts(
  page: number = 1,
  limit: number = 10,
  options: any = {}
) {
  const { user } = useUserStore();
  return useQuery({
    ...options,
    queryKey: postKeys.likedPosts({ page, limit }),
    queryFn: async () => {
      if (!user?.id) throw new Error("User not found");
      const response = await getPostUserLiked(user.id, page, limit);
      return response;
    },
  });
}

// ========== FETCH COMMUNITY LEADERBOARD ==========
export function useCommunityLeaderboard() {
  return useQuery({
    queryKey: postKeys.leaderboard(),
    queryFn: async () => {
      const response = await getCommunityLeaderboard();
      return response.data;
    },
  });
}

// ========== FETCH USER LIKED OR VIEWED POSTS (INFINITE) ==========
export function useUserLikedOrViewedPostsInfinite(
  postId: string,
  type: "likes" | "views",
  limit: number = 20
) {
  return useInfiniteQuery({
    queryKey: postKeys.userInteractions(postId, type, { limit }),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getUserLikedOrLikePosts(
        postId,
        pageParam,
        limit,
        type
      );
      return {
        data: response.data.data,
        meta: response.data.meta,
        nextPage:
          pageParam < response.data.meta.totalPages ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!postId,
    initialPageParam: 1,
  });
}

// ========== CREATE POST MUTATION ==========
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      title: string;
      topic: string;
      html: string;
      images: string[];
    }) => {
      const response = await createPost(
        params.title,
        params.topic,
        params.html,
        params.images
      );
      return response;
    },
    onSuccess: () => {
      // Invalidate my posts to refetch
      queryClient.invalidateQueries({ queryKey: postKeys.myPosts({}) });
      // Optionally invalidate community posts
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

// ========== EDIT POST MUTATION ==========
export function useEditPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      postId: string;
      title: string;
      topic: string;
      html: string;
      images: string[];
    }) => {
      const response = await editPost(
        params.postId,
        params.title,
        params.topic,
        params.html,
        params.images
      );
      return response;
    },
    onSuccess: (data, variables) => {
      // Update detail cache
      queryClient.setQueryData(postKeys.detail(variables.postId), data.data);
      // Invalidate my posts
      queryClient.invalidateQueries({ queryKey: postKeys.myPosts({}) });
      // Invalidate community posts
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

// ========== DELETE POST MUTATION ==========
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await deletePost(postId);
      return { postId, ...response };
    },
    // Optimistic update - xóa bài viết khỏi cache ngay lập tức
    onMutate: async (postId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: postKeys.all });

      // Snapshot previous data for rollback
      const previousQueries: [any, any][] = [];

      // Remove from all list queries optimistically
      const listQueries = queryClient.getQueriesData<{
        data: IPost[];
        meta: any;
      }>({
        queryKey: postKeys.lists(),
      });

      listQueries.forEach(([queryKey, queryData]) => {
        if (!queryData?.data) return;

        // Store previous data
        previousQueries.push([queryKey, queryData]);

        // Remove the post from the list
        const updatedData = queryData.data.filter((post) => post.id !== postId);

        queryClient.setQueryData(queryKey, {
          ...queryData,
          data: updatedData,
          meta: {
            ...queryData.meta,
            totalItems: queryData.meta.totalItems - 1,
          },
        });
      });

      // Remove from my posts queries
      const myPostsQueries = queryClient.getQueriesData<{
        data: IPost[];
        meta: any;
      }>({
        queryKey: postKeys.myPosts({}),
      });

      myPostsQueries.forEach(([queryKey, queryData]) => {
        if (!queryData?.data) return;

        // Store previous data
        previousQueries.push([queryKey, queryData]);

        // Remove the post from my posts
        const updatedData = queryData.data.filter((post) => post.id !== postId);

        queryClient.setQueryData(queryKey, {
          ...queryData,
          data: updatedData,
          meta: {
            ...queryData.meta,
            totalItems: queryData.meta.totalItems - 1,
          },
        });
      });

      return { previousQueries };
    },
    onSuccess: (data, postId) => {
      // Remove from detail cache
      queryClient.removeQueries({ queryKey: postKeys.detail(postId) });
      // Invalidate queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: postKeys.myPosts({}) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
    // Rollback on error
    onError: (err, postId, context) => {
      if (context?.previousQueries) {
        // Restore all previous data
        context.previousQueries.forEach(([queryKey, queryData]) => {
          queryClient.setQueryData(queryKey, queryData);
        });
      }
    },
  });
}
