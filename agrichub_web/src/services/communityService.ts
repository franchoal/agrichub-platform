import { api } from "./api";


export interface CommunityPost {
  id: number;
  author: number;
  author_name: string;
  author_email: string;
  content: string;
  post_type:
    | "discussion"
    | "knowledge"
    | "announcement"
    | "question";
  location: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}


export interface CommunityComment {
  id: number;
  post: number;
  author: number;
  author_name: string;
  content: string;
  parent: number | null;
  created_at: string;
  updated_at: string;
}


interface CommunityPostsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CommunityPost[];
}


interface CommunityCommentsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CommunityComment[];
}


/**
 * Get community posts
 */
export const getCommunityPosts = async (): Promise<CommunityPostsResponse> => {
  const response = await api.get<CommunityPostsResponse>(
    "/community/posts/"
  );

  return response.data;
};


/**
 * Get comments for a community post
 */
export const getCommunityComments = async (
  postId: number
): Promise<CommunityCommentsResponse> => {
  const response = await api.get<CommunityCommentsResponse>(
    `/community/posts/${postId}/comments/`
  );

  return response.data;
};


/**
 * Create a comment on a community post
 */
export const createCommunityComment = async (
  postId: number,
  content: string
): Promise<CommunityComment> => {
  const response = await api.post<CommunityComment>(
    `/community/posts/${postId}/comments/`,
    {
      content,
    }
  );

  return response.data;
};


/**
 * Connect with the author of a community post
 */
export const connectWithUser = async (
  userId: number
) => {
  const response = await api.post(
    "/community/connections/",
    {
      following: userId,
    }
  );

  return response.data;
};