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

    // Refresh new posts automatically every 10 seconds
    refetchInterval: 10000,

    // Refresh when the user returns to the browser/tab
    refetchOnWindowFocus: true,

    // Refresh after the network reconnects
    refetchOnReconnect: true,

    // Don't keep polling while the tab is hidden
    refetchIntervalInBackground: false,
  });
};


export const useConnections = () => {
  return useQuery<CommunityConnection[]>({
    queryKey: ["community-connections"],

    queryFn: async () => {
      const response = await getConnections();

      return response.results;
    },

    // Keep connection status reasonably fresh
    refetchInterval: 15000,

    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchIntervalInBackground: false,
  });
};


export const useConnectionRequests = () => {
  return useQuery<CommunityConnection[]>({
    queryKey: ["community-connection-requests"],

    queryFn: async () => {
      const response = await getConnectionRequests();

      return response.results;
    },

    // Keep requests fresh as well
    refetchInterval: 15000,

    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchIntervalInBackground: false,
  });
};