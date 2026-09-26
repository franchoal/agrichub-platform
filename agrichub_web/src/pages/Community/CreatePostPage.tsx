import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Image as ImageIcon,
  Leaf,
  MapPin,
  Send,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { api } from "../../services/api";
import { useProfileCompletion } from "../../hooks/useProfileCompletion";
import ProfileCompletionPrompt from "../../components/profile/ProfileCompletionPrompt";

type PostType =
  | "discussion"
  | "knowledge"
  | "announcement"
  | "question";

const CreatePostPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading: isLoadingProfile,
  } = useProfileCompletion();

  const [showProfilePrompt, setShowProfilePrompt] =
    useState(false);

  const [content, setContent] = useState("");
  const [postType, setPostType] =
    useState<PostType>("discussion");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const profileIsComplete = Boolean(
    profile?.location?.trim() &&
      profile?.bio?.trim()
  );

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile =
      event.target.files?.[0] || null;

    setImage(selectedFile);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isLoadingProfile) {
      return;
    }

    if (!profileIsComplete) {
      setShowProfilePrompt(true);
      return;
    }

    if (!content.trim()) {
      setError("Please write something before posting.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("content", content.trim());
      formData.append("post_type", postType);

      if (location.trim()) {
        formData.append(
          "location",
          location.trim()
        );
      }

      if (image) {
        formData.append("image", image);
      }

      await api.post(
        "/community/posts/",
        formData
      );

      await queryClient.invalidateQueries({
        queryKey: ["community-posts"],
      });

      navigate("/");
    } catch (err) {
      console.error(
        "Failed to create community post:",
        err
      );

      setError(
        "We couldn't publish your post. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
  =========================================
  PROFILE COMPLETION GATE
  =========================================

  If a user directly visits /community/create
  before completing their profile, show the
  existing profile completion prompt instead
  of allowing them to create a post.
  */
  if (
    !isLoadingProfile &&
    !profileIsComplete
  ) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="border-b border-gray-100 bg-white">
          <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-green-50 hover:text-green-700"
                aria-label="Back to community"
              >
                <ArrowLeft size={19} />
              </Link>

              <div>
                <p className="text-xs font-medium text-gray-500">
                  AgricWise Community
                </p>

                <h1 className="text-lg font-black text-gray-900">
                  Create a Post
                </h1>
              </div>
            </div>
          </div>
        </section>

        <ProfileCompletionPrompt
          onClose={() => navigate("/")}
        />
      </main>
    );
  }

  /*
  =========================================
  LOADING PROFILE
  =========================================
  */

  if (isLoadingProfile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mb-4 text-4xl">
            🌾
          </div>

          <p className="font-semibold text-green-700">
            Checking your profile...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-24">

      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <section className="border-b border-gray-100 bg-white">

        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">

          <div className="flex items-center gap-3">

            <Link
              to="/"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-green-50 hover:text-green-700"
              aria-label="Back to community"
            >
              <ArrowLeft size={19} />
            </Link>

            <div>
              <p className="text-xs font-medium text-gray-500">
                AgricWise Community
              </p>

              <h1 className="text-lg font-black text-gray-900">
                Create a Post
              </h1>
            </div>

          </div>

        </div>

      </section>


      {/* ========================================= */}
      {/* FORM */}
      {/* ========================================= */}

      <section className="mx-auto max-w-3xl px-4 py-6 sm:px-6">

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
        >

          {/* POST CONTENT */}

          <div className="p-5 sm:p-6">

            <div className="flex items-start gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                <Leaf size={20} />
              </div>

              <div className="min-w-0 flex-1">

                <label
                  htmlFor="post-content"
                  className="text-sm font-bold text-gray-900"
                >
                  What is happening in agriculture?
                </label>

                <textarea
                  id="post-content"
                  value={content}
                  onChange={(event) =>
                    setContent(event.target.value)
                  }
                  placeholder="Share an update, ask a question, share knowledge or start a discussion..."
                  rows={7}
                  maxLength={5000}
                  className="mt-3 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                />

                <div className="mt-2 flex justify-end text-xs text-gray-400">
                  {content.length}/5000
                </div>

              </div>

            </div>

          </div>


          {/* POST TYPE */}

          <div className="border-t border-gray-100 px-5 py-5 sm:px-6">

            <label className="text-sm font-bold text-gray-900">
              Post type
            </label>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">

              {[
                {
                  value: "discussion",
                  label: "Discussion",
                },
                {
                  value: "knowledge",
                  label: "Knowledge",
                },
                {
                  value: "question",
                  label: "Question",
                },
                {
                  value: "announcement",
                  label: "Announcement",
                },
              ].map((type) => (

                <button
                  key={type.value}
                  type="button"
                  onClick={() =>
                    setPostType(
                      type.value as PostType
                    )
                  }
                  className={`rounded-xl border px-3 py-3 text-xs font-bold transition ${
                    postType === type.value
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {type.label}
                </button>

              ))}

            </div>

          </div>


          {/* LOCATION */}

          <div className="border-t border-gray-100 px-5 py-5 sm:px-6">

            <label
              htmlFor="post-location"
              className="flex items-center gap-2 text-sm font-bold text-gray-900"
            >
              <MapPin
                size={16}
                className="text-green-700"
              />

              Location

              <span className="font-normal text-gray-400">
                Optional
              </span>
            </label>

            <input
              id="post-location"
              type="text"
              value={location}
              onChange={(event) =>
                setLocation(event.target.value)
              }
              placeholder="e.g. Abeokuta, Ogun State"
              maxLength={255}
              className="mt-3 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
            />

          </div>


          {/* IMAGE */}

          <div className="border-t border-gray-100 px-5 py-5 sm:px-6">

            <label
              htmlFor="post-image"
              className="flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-4 transition hover:border-green-500 hover:bg-green-50"
            >

              <span className="flex items-center gap-3">

                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-green-700 shadow-sm">
                  <ImageIcon size={19} />
                </span>

                <span>
                  <span className="block text-sm font-bold text-gray-800">
                    Add an image
                  </span>

                  <span className="block text-xs text-gray-500">
                    Share a photo with the community
                  </span>
                </span>

              </span>

              <span className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-green-700 shadow-sm">
                Browse
              </span>

            </label>

            <input
              id="post-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {image && (
              <div className="mt-3 rounded-xl bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
                Selected: {image.name}
              </div>
            )}

          </div>


          {/* ERROR */}

          {error && (

            <div className="mx-5 mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 sm:mx-6">
              {error}
            </div>

          )}


          {/* SUBMIT */}

          <div className="border-t border-gray-100 bg-gray-50 px-5 py-4 sm:px-6">

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send size={17} />

              {isSubmitting
                ? "Publishing..."
                : "Publish Post"}
            </button>

          </div>

        </form>

      </section>

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

export default CreatePostPage;