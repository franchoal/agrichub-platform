import { api } from "./api";


export interface CommunityPost {
  id: number;
  author: number;
  author_name: string;
  author_email: string;
  content: string;
  post_type: "discussion" | "knowledge" | "announcement" | "question";
  location: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}


interface CommunityPostsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CommunityPost[];
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