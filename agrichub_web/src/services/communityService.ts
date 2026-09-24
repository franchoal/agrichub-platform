import { api } from "./api";


export interface CommunityPost {
  id: number;
  author: number;
  author_name: string;
  author_email: string;
  author_photo: string | null;
  author_connection_count: number;
  content: string;
  post_type: "discussion" | "knowledge" | "announcement" | "question";
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


export interface CommunityConnection {
  id: number;
  follower: number;
  follower_name: string;
  following: number;
  following_name: string;
  status: "pending" | "accepted" | "rejected";
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


interface CommunityConnectionsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CommunityConnection[];
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
 * Send a connection request to another user
 */
export const connectWithUser = async (
  userId: number
): Promise<CommunityConnection> => {
  const response = await api.post<CommunityConnection>(
    "/community/connections/",
    {
      following: userId,
    }
  );

  return response.data;
};


/**
 * Get accepted connections for the current user
 */
export const getConnections = async (): Promise<CommunityConnectionsResponse> => {
  const response = await api.get<CommunityConnectionsResponse>(
    "/community/connections/"
  );

  return response.data;
};


/**
 * Get incoming pending connection requests
 */
export const getConnectionRequests =
  async (): Promise<CommunityConnectionsResponse> => {
    const response = await api.get<CommunityConnectionsResponse>(
      "/community/connections/requests/"
    );

    return response.data;
  };


/**
 * Accept a connection request
 */
export const acceptConnectionRequest = async (
  connectionId: number
): Promise<CommunityConnection> => {
  const response = await api.post<CommunityConnection>(
    `/community/connections/${connectionId}/accept/`
  );

  return response.data;
};


/**
 * Reject a connection request
 */
export const rejectConnectionRequest = async (
  connectionId: number
): Promise<CommunityConnection> => {
  const response = await api.post<CommunityConnection>(
    `/community/connections/${connectionId}/reject/`
  );

  return response.data;
};