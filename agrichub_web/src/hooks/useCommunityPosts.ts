import { useQuery } from "@tanstack/react-query";

import {
  getCommunityPosts,
  type CommunityPost,
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