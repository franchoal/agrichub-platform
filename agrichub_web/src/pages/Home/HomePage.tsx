import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import ProfileCompletionPrompt from "../../components/profile/ProfileCompletionPrompt";
import { useProfileCompletion } from "../../hooks/useProfileCompletion";

import {
  ArrowRight,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  ChevronRight,
  Image as ImageIcon,
  Leaf,
  MessageCircle,
  Package,
  Plus,
  Search,
  Send,
  ShoppingBasket,
  Sparkles,
  Tractor,
  Users,
  Wrench,
} from "lucide-react";

import {
  heroFarm,
  vegetables,
  fruits,
  grains,
  livestock,
} from "../../assets/images";

import {
  useCommunityPosts,
  useConnections,
} from "../../hooks/useCommunityPosts";

import {
  connectWithUser,
  createCommunityComment,
  getCommunityComments,
  type CommunityComment,
} from "../../services/communityService";

const HomePage = () => {
  const queryClient = useQueryClient();

  const [showProfilePrompt, setShowProfilePrompt] =
    useState(false);

  const {
    data: profile,
    isLoading: isLoadingProfile,
  } = useProfileCompletion();

  const profileIsComplete = Boolean(
    profile?.location?.trim() &&
      profile?.bio?.trim()
  );

  const [openComments, setOpenComments] =
    useState<number | null>(null);

  const [comments, setComments] = useState<
    Record<number, CommunityComment[]>
  >({});

  const [commentText, setCommentText] = useState<
    Record<number, string>
  >({});

  const [isLoadingComments, setIsLoadingComments] =
    useState<Record<number, boolean>>({});

  const [isSubmittingComment, setIsSubmittingComment] =
    useState<Record<number, boolean>>({});

  const [connectionStatus, setConnectionStatus] =
    useState<Record<number, "connected">>({});

  const [isConnecting, setIsConnecting] =
    useState<Record<number, boolean>>({});

  const {
    data: communityPosts = [],
    isLoading: isLoadingPosts,
    isError: isPostsError,
  } = useCommunityPosts();

  const {
    data: connections = [],
  } = useConnections();

  const formatPostDate = (date: string) => {
    return new Intl.DateTimeFormat("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  const getPostTypeLabel = (postType: string) => {
    switch (postType) {
      case "knowledge":
        return "Knowledge";

      case "announcement":
        return "Announcement";

      case "question":
        return "Question";

      default:
        return "Discussion";
    }
  };

  /*
  ==========================================
  PROFILE COMPLETION CHECK
  ==========================================
  */

  const requireCompleteProfile = () => {
    // Do not interrupt the user while the profile
    // information is still being loaded.
    if (isLoadingProfile) {
      return false;
    }

    if (!profileIsComplete) {
      setShowProfilePrompt(true);
      return false;
    }

    return true;
  };

  const handleToggleComments = async (
    postId: number
  ) => {
    if (!requireCompleteProfile()) {
      return;
    }

    if (openComments === postId) {
      setOpenComments(null);
      return;
    }

    setOpenComments(postId);

    if (comments[postId]) {
      return;
    }

    setIsLoadingComments((previous) => ({
      ...previous,
      [postId]: true,
    }));

    try {
      const response =
        await getCommunityComments(postId);

      setComments((previous) => ({
        ...previous,
        [postId]: response.results,
      }));
    } catch (error) {
      console.error(
        "Failed to load community comments:",
        error
      );
    } finally {
      setIsLoadingComments((previous) => ({
        ...previous,
        [postId]: false,
      }));
    }
  };

  useEffect(() => {
    if (openComments === null) {
      return;
    }

    const postId = openComments;

    const refreshComments = async () => {
      try {
        const response =
          await getCommunityComments(postId);

        setComments((previous) => ({
          ...previous,
          [postId]: response.results,
        }));
      } catch (error) {
        console.error(
          "Failed to refresh community comments:",
          error
        );
      }
    };

    const interval = window.setInterval(
      refreshComments,
      10000
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [openComments]);

  const handleSubmitComment = async (
    postId: number
  ) => {
    if (!requireCompleteProfile()) {
      return;
    }

    const content =
      commentText[postId]?.trim();

    if (!content) {
      return;
    }

    setIsSubmittingComment((previous) => ({
      ...previous,
      [postId]: true,
    }));

    try {
      const newComment =
        await createCommunityComment(
          postId,
          content
        );

      setComments((previous) => ({
        ...previous,
        [postId]: [
          ...(previous[postId] || []),
          newComment,
        ],
      }));

      setCommentText((previous) => ({
        ...previous,
        [postId]: "",
      }));
    } catch (error) {
      console.error(
        "Failed to create community comment:",
        error
      );
    } finally {
      setIsSubmittingComment((previous) => ({
        ...previous,
        [postId]: false,
      }));
    }
  };

  const getConnectionStatus = (
    userId: number
  ) => {
    if (connectionStatus[userId]) {
      return connectionStatus[userId];
    }

    const connection = connections.find(
      (item) =>
        item.follower === userId ||
        item.following === userId
    );

    if (!connection) {
      return null;
    }

    if (connection.status === "accepted") {
      return "connected";
    }

    return null;
  };

  const handleConnect = async (
    userId: number
  ) => {
    if (!requireCompleteProfile()) {
      return;
    }

    const status =
      getConnectionStatus(userId);

    if (status === "connected") {
      return;
    }

    setIsConnecting((previous) => ({
      ...previous,
      [userId]: true,
    }));

    try {
      await connectWithUser(userId);

      setConnectionStatus((previous) => ({
        ...previous,
        [userId]: "connected",
      }));

      await queryClient.invalidateQueries({
        queryKey: ["community-connections"],
      });
    } catch (error) {
      console.error(
        "Failed to connect with user:",
        error
      );
    } finally {
      setIsConnecting((previous) => ({
        ...previous,
        [userId]: false,
      }));
    }
  };

  /*
  ==========================================
  CREATE POST NAVIGATION
  ==========================================
  */

  const handleCreatePostClick = (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    if (!requireCompleteProfile()) {
      event.preventDefault();
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-24">

      {/* ========================================= */}
      {/* APP HEADER / COMMUNITY WELCOME */}
      {/* ========================================= */}

      <section className="border-b border-gray-100 bg-white">

        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <Leaf size={22} />
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500">
                  Welcome to
                </p>

                <h1 className="text-xl font-black text-gray-900">
                  AgricWise
                </h1>
              </div>

            </div>

            <div className="flex items-center gap-2">

              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-green-50 hover:text-green-700"
                aria-label="Search"
              >
                <Search size={19} />
              </button>

              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-green-50 hover:text-green-700"
                aria-label="Notifications"
              >
                <Bell size={19} />
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* ========================================= */}
      {/* COMMUNITY HERO */}
      {/* ========================================= */}

      <section className="relative overflow-hidden bg-green-950">

        <img
          src={heroFarm}
          alt="Agricultural community"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-br from-green-950/95 via-green-900/90 to-green-800/70" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

          <div className="max-w-3xl">

            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-green-100 backdrop-blur">
              <Sparkles size={14} />
              Connect. Trade. Grow.
            </span>

            <h2 className="mt-5 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
              Agriculture works
              <span className="block text-yellow-300">
                better together.
              </span>
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-green-50 sm:text-base sm:leading-7">
              Connect with farmers, businesses, professionals and
              agricultural communities. Share knowledge, discover
              opportunities and get things done.
            </p>

          </div>

        </div>

      </section>

      {/* ========================================= */}
      {/* CREATE / PARTICIPATE */}
      {/* ========================================= */}

      <section className="relative z-10 mx-auto -mt-6 max-w-3xl px-4 sm:px-6 lg:px-8">

        <div className="rounded-2xl bg-white p-4 shadow-xl">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
              <Leaf size={20} />
            </div>

            <Link
              to="/community/create"
              onClick={handleCreatePostClick}
              className="flex-1 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-500 transition hover:bg-green-50"
            >
              What is happening in agriculture?
            </Link>

            <Link
              to="/community/create"
              onClick={handleCreatePostClick}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-700 text-white transition hover:bg-green-800"
              aria-label="Create post"
            >
              <Plus size={21} />
            </Link>

          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 border-t border-gray-100 pt-3 sm:grid-cols-5">

            <Link
              to="/community/create"
              onClick={handleCreatePostClick}
              className="flex items-center justify-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-gray-600 transition hover:bg-green-50 hover:text-green-700"
            >
              <ImageIcon size={16} />

              <span className="hidden sm:inline">
                Post
              </span>
            </Link>

            <Link
              to="/products"
              className="flex items-center justify-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-gray-600 transition hover:bg-green-50 hover:text-green-700"
            >
              <ShoppingBasket size={16} />

              <span className="hidden sm:inline">
                Sell
              </span>
            </Link>

            <Link
              to="/products"
              className="flex items-center justify-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-gray-600 transition hover:bg-green-50 hover:text-green-700"
            >
              <Wrench size={16} />

              <span className="hidden sm:inline">
                Service
              </span>
            </Link>

            <Link
              to="/products"
              className="hidden items-center justify-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-gray-600 transition hover:bg-green-50 hover:text-green-700 sm:flex"
            >
              <Search size={16} />
              Request
            </Link>

            <Link
              to="/community/create"
              onClick={handleCreatePostClick}
              className="hidden items-center justify-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-gray-600 transition hover:bg-green-50 hover:text-green-700 sm:flex"
            >
              <MessageCircle size={16} />
              Discuss
            </Link>

          </div>

        </div>

      </section>

      {/* ========================================= */}
      {/* MAIN COMMUNITY AREA */}
      {/* ========================================= */}

      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">

          {/* ===================================== */}
          {/* FEED */}
          {/* ===================================== */}

          <div>

            <div className="mb-5 flex items-center justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-green-700">
                  Community
                </p>

                <h2 className="mt-1 text-2xl font-black text-gray-900">
                  What's happening?
                </h2>
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-1 text-sm font-semibold text-green-700"
              >
                Latest
                <ChevronRight size={16} />
              </button>

            </div>

            {/* =================================== */}
            {/* LOADING */}
            {/* =================================== */}

            {isLoadingPosts && (

              <div className="space-y-4">

                {[1, 2].map((item) => (

                  <div
                    key={item}
                    className="animate-pulse rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
                  >

                    <div className="flex gap-3">

                      <div className="h-11 w-11 rounded-full bg-gray-200" />

                      <div className="flex-1">

                        <div className="h-4 w-40 rounded bg-gray-200" />

                        <div className="mt-2 h-3 w-24 rounded bg-gray-100" />

                      </div>

                    </div>

                    <div className="mt-5 h-4 w-full rounded bg-gray-100" />

                    <div className="mt-2 h-4 w-4/5 rounded bg-gray-100" />

                  </div>

                ))}

              </div>

            )}

            {/* =================================== */}
            {/* ERROR */}
            {/* =================================== */}

            {isPostsError && (

              <div className="rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <MessageCircle size={21} />
                </div>

                <h3 className="mt-4 font-bold text-gray-900">
                  Community feed unavailable
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  We couldn't load the latest community posts.
                  Please try again shortly.
                </p>

              </div>

            )}

            {/* =================================== */}
            {/* EMPTY STATE */}
            {/* =================================== */}

            {!isLoadingPosts &&
              !isPostsError &&
              communityPosts.length === 0 && (

                <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-700">
                    <Users size={22} />
                  </div>

                  <h3 className="mt-4 font-bold text-gray-900">
                    The community is just getting started
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                    Be one of the first people to share an
                    agricultural update, ask a question or
                    start a discussion.
                  </p>

                  <Link
                    to="/community/create"
                    onClick={handleCreatePostClick}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-800"
                  >
                    Create a Post
                    <ArrowRight size={17} />
                  </Link>

                </div>
              )}

            {/* =================================== */}
            {/* REAL COMMUNITY POSTS */}
            {/* =================================== */}

            {!isLoadingPosts &&
              !isPostsError &&
              communityPosts.map((post) => {

                const authorInitials =
                  `${post.author_name?.charAt(0) || ""}${post.author_name?.split(" ")[1]?.charAt(0) || ""}`
                    .toUpperCase();

                const authorConnectionStatus =
                  getConnectionStatus(
                    post.author
                  );

                return (

                  <article
                    key={post.id}
                    className="mb-5 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                  >

                    {/* POST CONTENT */}

                    <div className="p-5 sm:p-6">

                      {/* AUTHOR */}

                      <div className="flex items-start gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-green-100 text-sm font-black text-green-700">

                          {post.author_photo ? (
                            <img
                              src={post.author_photo}
                              alt={
                                post.author_name ||
                                "AgricWise Member"
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            authorInitials || "A"
                          )}

                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">

                            <h3 className="font-bold text-gray-900">
                              {post.author_name ||
                                "AgricWise Member"}
                            </h3>

                            <span className="text-gray-300">
                              •
                            </span>

                            <span className="text-xs text-gray-500">
                              {formatPostDate(
                                post.created_at
                              )}
                            </span>

                            {post.author_connection_count >
                              0 && (
                              <>
                                <span className="text-gray-300">
                                  •
                                </span>

                                <span className="text-xs text-gray-500">
                                  {
                                    post.author_connection_count
                                  }{" "}
                                  {post.author_connection_count ===
                                  1
                                    ? "connection"
                                    : "connections"}
                                </span>
                              </>
                            )}

                          </div>

                          <div className="mt-1 flex flex-wrap items-center gap-2">

                            <span className="rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-700">
                              {getPostTypeLabel(
                                post.post_type
                              )}
                            </span>

                            {post.location && (
                              <span className="text-xs text-gray-500">
                                {post.location}
                              </span>
                            )}

                          </div>

                        </div>

                      </div>

                      {/* CONTENT */}

                      <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-gray-700">
                        {post.content}
                      </p>

                    </div>

                    {/* IMAGE */}

                    {post.image && (

                      <div className="overflow-hidden border-y border-gray-100 bg-gray-50">

                        <img
                          src={post.image}
                          alt="Community post"
                          className="max-h-[520px] w-full object-cover"
                        />

                      </div>

                    )}

                    {/* ACTIONS */}

                    <div className="flex items-center gap-6 border-t border-gray-100 px-5 py-4 text-xs font-semibold text-gray-500 sm:px-6">

                      <button
                        type="button"
                        onClick={() =>
                          handleToggleComments(
                            post.id
                          )
                        }
                        className={`inline-flex items-center gap-1.5 transition ${
                          openComments === post.id
                            ? "text-green-700"
                            : "hover:text-green-700"
                        }`}
                      >

                        <MessageCircle size={16} />

                        Comment

                        {comments[post.id]?.length > 0 && (
                          <span className="rounded-full bg-green-50 px-1.5 py-0.5 text-[10px] text-green-700">
                            {comments[post.id].length}
                          </span>
                        )}

                      </button>

                      {/* CONNECTION */}

                      <button
                        type="button"
                        onClick={() =>
                          handleConnect(
                            post.author
                          )
                        }
                        disabled={
                          isConnecting[
                            post.author
                          ] ||
                          authorConnectionStatus ===
                            "connected"
                        }
                        className={`inline-flex items-center gap-1.5 transition ${
                          authorConnectionStatus
                            ? "text-green-700"
                            : "hover:text-green-700"
                        } disabled:cursor-not-allowed`}
                      >

                        <Send size={16} />

                        {isConnecting[
                          post.author
                        ]
                          ? "Connecting..."
                          : authorConnectionStatus ===
                              "connected"
                            ? "Connected"
                            : "Connect"}

                      </button>

                    </div>

                    {/* COMMENTS */}

                    {openComments === post.id && (

                      <div className="border-t border-gray-100 bg-gray-50 px-5 py-5 sm:px-6">

                        {/* COMMENT LIST */}

                        {isLoadingComments[
                          post.id
                        ] ? (

                          <p className="text-sm text-gray-500">
                            Loading comments...
                          </p>

                        ) : comments[
                            post.id
                          ]?.length > 0 ? (

                          <div className="space-y-4">

                            {comments[
                              post.id
                            ].map((comment) => (

                              <div
                                key={comment.id}
                                className="flex gap-3"
                              >

                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-black text-green-700">
                                  {comment.author_name
                                    ?.charAt(0)
                                    .toUpperCase() ||
                                    "A"}
                                </div>

                                <div className="min-w-0 flex-1 rounded-xl bg-white px-4 py-3">

                                  <p className="text-xs font-bold text-gray-900">
                                    {comment.author_name ||
                                      "AgricWise Member"}
                                  </p>

                                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                                    {comment.content}
                                  </p>

                                </div>

                              </div>

                            ))}

                          </div>

                        ) : (

                          <p className="text-sm text-gray-500">
                            No comments yet. Start the
                            conversation.
                          </p>

                        )}

                        {/* COMMENT INPUT */}

                        <div className="mt-4 flex gap-2">

                          <input
                            type="text"
                            value={
                              commentText[
                                post.id
                              ] || ""
                            }
                            onChange={(event) =>
                              setCommentText(
                                (previous) => ({
                                  ...previous,
                                  [post.id]:
                                    event.target.value,
                                })
                              )
                            }
                            onKeyDown={(event) => {

                              if (
                                event.key ===
                                "Enter"
                              ) {
                                event.preventDefault();

                                handleSubmitComment(
                                  post.id
                                );
                              }

                            }}
                            placeholder="Write a comment..."
                            className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              handleSubmitComment(
                                post.id
                              )
                            }
                            disabled={
                              isSubmittingComment[
                                post.id
                              ] ||
                              !commentText[
                                post.id
                              ]?.trim()
                            }
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-700 text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Send comment"
                          >

                            <Send size={17} />

                          </button>

                        </div>

                      </div>

                    )}

                  </article>

                );
              })}

            {/* =================================== */}
            {/* START CONVERSATION */}
            {/* =================================== */}

            {!isLoadingPosts &&
              !isPostsError &&
              communityPosts.length > 0 && (

                <div className="mt-5 rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-700">
                    <Plus size={22} />
                  </div>

                  <h3 className="mt-4 font-bold text-gray-900">
                    Start the conversation
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                    Share an agricultural update, ask a question,
                    share knowledge or start a discussion.
                  </p>

                  <Link
                    to="/community/create"
                    onClick={handleCreatePostClick}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-800"
                  >
                    Create a Post
                    <ArrowRight size={17} />
                  </Link>

                </div>
              )}

          </div>

          {/* ===================================== */}
          {/* RIGHT SIDEBAR */}
          {/* ===================================== */}

          <aside className="space-y-5">

            {/* DISCOVER */}

            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-green-700">
                    Discover
                  </p>

                  <h3 className="mt-1 font-black text-gray-900">
                    Explore AgricWise
                  </h3>
                </div>

                <Search
                  size={19}
                  className="text-gray-400"
                />

              </div>

              <div className="mt-4 space-y-2">

                {[
                  {
                    icon: Package,
                    label: "Products",
                    href: "/products",
                  },
                  {
                    icon: Wrench,
                    label: "Services",
                    href: "/products",
                  },
                  {
                    icon: Tractor,
                    label: "Equipment",
                    href: "/products",
                  },
                  {
                    icon: Users,
                    label: "People & Businesses",
                    href: "/products",
                  },
                  {
                    icon: BookOpen,
                    label: "Knowledge",
                    href: "/products",
                  },
                  {
                    icon: BriefcaseBusiness,
                    label: "Opportunities",
                    href: "/products",
                  },
                ].map((item) => {

                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.label}
                      to={item.href}
                      className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-3 transition hover:bg-green-50"
                    >

                      <span className="flex items-center gap-3">

                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-green-700 shadow-sm">
                          <Icon size={17} />
                        </span>

                        <span className="text-sm font-semibold text-gray-700">
                          {item.label}
                        </span>

                      </span>

                      <ChevronRight
                        size={16}
                        className="text-gray-400"
                      />

                    </Link>
                  );

                })}

              </div>

            </div>

            {/* MARKETPLACE CATEGORIES */}

            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-green-700">
                    Marketplace
                  </p>

                  <h3 className="mt-1 font-black text-gray-900">
                    Agricultural Products
                  </h3>
                </div>

                <Link
                  to="/products"
                  className="text-green-700"
                >
                  <ChevronRight size={18} />
                </Link>

              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">

                {[
                  {
                    image: vegetables,
                    title: "Vegetables",
                  },
                  {
                    image: fruits,
                    title: "Fruits",
                  },
                  {
                    image: grains,
                    title: "Grains",
                  },
                  {
                    image: livestock,
                    title: "Livestock",
                  },
                ].map((category) => (

                  <Link
                    key={category.title}
                    to="/products"
                    className="group relative overflow-hidden rounded-xl"
                  >

                    <div className="h-24 overflow-hidden">

                      <img
                        src={category.image}
                        alt={category.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-black/30" />

                      <span className="absolute bottom-2 left-2 text-xs font-bold text-white">
                        {category.title}
                      </span>

                    </div>

                  </Link>

                ))}

              </div>

            </div>

            {/* PARTICIPATE */}

            <div className="rounded-2xl bg-green-900 p-5 text-white">

              <Sparkles
                size={22}
                className="text-yellow-300"
              />

              <h3 className="mt-3 font-black">
                One account. Many possibilities.
              </h3>

              <p className="mt-2 text-sm leading-6 text-green-100">
                Buy, sell, offer, request, connect, learn and
                participate without choosing a permanent role.
              </p>

              <Link
                to="/register"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-green-800"
              >
                Join AgricWise
                <ArrowRight size={16} />
              </Link>

            </div>

          </aside>

        </div>

      </section>

      {/* ========================================= */}
      {/* PROFILE COMPLETION PROMPT */}
      {/* ========================================= */}

      {showProfilePrompt && (
        <ProfileCompletionPrompt
          onClose={() =>
            setShowProfilePrompt(false)
          }
        />
      )}

    </main>
  );
};

export default HomePage;