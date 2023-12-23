import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { INewPost, INewUser, IUpdatePost } from "@/types";
import {
  createPost,
  createUserAccount,
  deletePost,
  deleteSavedPost,
  getCurrentAccount,
  getInfinitePosts,
  getPostById,
  getPosts,
  getUserPosts,
  getUsers,
  likePost,
  savePost,
  searchPost,
  signInAccount,
  signOutAccount,
  updatePost,
} from "../api";

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    //@ts-ignore
    mutationFn: () => signOutAccount,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Posts"],
      });
    },
  });
};

export const useGetPost = () => {
  return useQuery({
    queryKey: ["get-recent-post"],
    queryFn: getPosts,
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      likesArray,
    }: {
      postId: string;
      likesArray: string[];
    }) => likePost(postId, likesArray),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["get-post-by-id", data?.$id],
      });

      queryClient.invalidateQueries({
        queryKey: ["get-recent-post"],
      });

      queryClient.invalidateQueries({
        queryKey: ["get-posts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-current-user"],
      });
    },
  });
};

export const useSavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
      savePost(userId, postId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-recent-post"],
      });

      queryClient.invalidateQueries({
        queryKey: ["get-posts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-current-user"],
      });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (savedId: string) => deleteSavedPost(savedId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-recent-post"],
      });

      queryClient.invalidateQueries({
        queryKey: ["get-posts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-current-user"],
      });
    },
  });
};

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ["get-current-user"],
    queryFn: getCurrentAccount,
  });
};

export const useGetPostById = (postId: string) => {
  return useQuery({
    queryKey: ["get-post-byId", postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-post-by-id"],
      });
    },
  });
};

export const useDeletePostOfUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, imageId }: { postId: string; imageId: string }) =>
      deletePost(postId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-recent-post"],
      });
    },
  });
};

export const useGetUserPosts = (userId?: string) => {
  return useQuery({
    queryKey: ["get-user-post", userId],
    queryFn: () => getUserPosts(userId),
    enabled: !!userId,
  });
};

export const useGetPosts = () => {
  //@ts-ignore
  return useInfiniteQuery({
    queryKey: ["QUERY_KEYS.GET_INFINITE_POSTS"],
    queryFn: getInfinitePosts as any,
    getNextPageParam: (lastPage: any) => {
      if (lastPage && lastPage.documents.length === 0) {
        return null;
      }

      const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
      return lastId;
    },
  });
};

export const useSearchTerm = (searchTerm: string) => {
  return useQuery({
    queryKey: ["search-term"],
    queryFn: () => searchPost(searchTerm),
    enabled: !!searchTerm,
  });
};

export const useGetUsers = (limit?: number) => {
  return useQuery({
    queryKey: ["get-user"],
    queryFn: () => getUsers(limit),
  });
};
