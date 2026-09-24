import { useQuery } from "@tanstack/react-query";

import {
  getCommunityPosts,
  getConnections,
  getConnectionRequests,
  type CommunityPost,
  type CommunityConnection,
} from "../services/communityService";


export const useCommunityPosts = () => {
  return useQuery<CommunityPost[]>({
    queryKey: ["community-posts"],

    queryFn: async () => {
      const response = await getCommunityPosts();

      return response.results;
    },
  });
};


export const useConnections = () => {
  return useQuery<CommunityConnection[]>({
    queryKey: ["community-connections"],

    queryFn: async () => {
      const response = await getConnections();

      return response.results;
    },
  });
};


export const useConnectionRequests = () => {
  return useQuery<CommunityConnection[]>({
    queryKey: ["community-connection-requests"],

    queryFn: async () => {
      const response = await getConnectionRequests();

      return response.results;
    },
  });
};