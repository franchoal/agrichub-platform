import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Image as ImageIcon,
  Leaf,
  MapPin,
  Send,
  ShoppingBag,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { api } from "../../services/api";
import { farmerService } from "../../services/farmerService";
import { useProfileCompletion } from "../../hooks/useProfileCompletion";
import ProfileCompletionPrompt from "../../components/profile/ProfileCompletionPrompt";

type PostType =
  | "discussion"
  | "knowledge"
  | "announcement"
  | "question"
  | "for_sale"
  | "service";

interface Category {
  id: number;
  name: string;
  slug: string;
}

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

  /* =========================================
     FOR SALE PRODUCT FIELDS
  ========================================= */

  const [categories, setCategories] =
    useState<Category[]>([]);
  const [category, setCategory] = useState("");
  const [productName, setProductName] =
    useState("");
  const [productDescription, setProductDescription] =
    useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] =
    useState("1");
  const [unit, setUnit] = useState("kg");

  const [isLoadingCategories, setIsLoadingCategories] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const profileIsComplete = Boolean(
    profile?.location?.trim() &&
      profile?.bio?.trim()
  );

  /* =========================================
     LOAD PRODUCT CATEGORIES
  ========================================= */

  useEffect(() => {
    if (postType !== "for_sale") {
      return;
    }

    const loadCategories = async () => {
      setIsLoadingCategories(true);

      try {
        const response =
          await api.get<Category[]>(
            "/products/categories/"
          );

        setCategories(response.data);
      } catch (err) {
        console.error(
          "Failed to load product categories:",
          err
        );

        setError(
          "We couldn't load product categories. Please try again."
        );
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, [postType]);

  /* =========================================
     IMAGE
  ========================================= */

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile =
      event.target.files?.[0] || null;

    setImage(selectedFile);
  };

  /* =========================================
     POST TYPE
  ========================================= */

  const handlePostTypeChange = (
    type: PostType
  ) => {
    setPostType(type);
    setError("");
  };

  /* =========================================
     SUBMIT
  ========================================= */

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

    /* =========================================
       FARMER PROFILE CHECK
    =========================================

    A For Sale post creates both:

    1. A marketplace Product
    2. A linked Community Post

    The Product requires a FarmerProfile.

    Users without a FarmerProfile are sent
    through the existing farmer onboarding
    flow and returned here afterwards.
    */

    if (postType === "for_sale") {
      try {
        await farmerService.getProfile();
      } catch (err: any) {
        const status =
          err?.response?.status;

        /*
        The current FarmerProfile GET endpoint
        uses IsFarmer. Therefore, an authenticated
        user without a FarmerProfile currently
        receives 403.

        Send that user to the existing onboarding
        page rather than allowing the listing
        request to fail later.
        */

        if (
          status === 403 ||
          status === 404
        ) {
          navigate(
            "/farmer/profile?returnTo=/community/create",
            {
              replace: true,
            }
          );

          return;
        }

        console.error(
          "Failed to check farmer profile:",
          err
        );

        setError(
          "We couldn't verify your seller profile. Please try again."
        );

        return;
      }
    }

    if (!content.trim()) {
      setError(
        "Please write something before posting."
      );
      return;
    }

    /* =========================================
       FOR SALE VALIDATION
    ========================================= */

    if (postType === "for_sale") {
      if (!category) {
        setError(
          "Please select a product category."
        );
        return;
      }

      if (!productName.trim()) {
        setError(
          "Please enter the product name."
        );
        return;
      }

      if (!productDescription.trim()) {
        setError(
          "Please enter a product description."
        );
        return;
      }

      if (
        !price ||
        Number(price) <= 0
      ) {
        setError(
          "Please enter a valid product price."
        );
        return;
      }

      if (
        !quantity ||
        Number(quantity) < 1
      ) {
        setError(
          "Quantity must be at least 1."
        );
        return;
      }
    }

    setError("");
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append(
        "content",
        content.trim()
      );

      formData.append(
        "post_type",
        postType
      );

      if (location.trim()) {
        formData.append(
          "location",
          location.trim()
        );
      }

      /* =========================================
         FOR SALE
      ========================================= */

      if (postType === "for_sale") {
        formData.append(
          "category",
          category
        );

        formData.append(
          "name",
          productName.trim()
        );

        formData.append(
          "description",
          productDescription.trim()
        );

        formData.append(
          "price",
          price
        );

        formData.append(
          "quantity",
          quantity
        );

        formData.append(
          "unit",
          unit
        );

        if (image) {
          formData.append(
            "image",
            image
          );
        }

        await api.post(
          "/community/posts/for-sale/",
          formData
        );
      } else {
        /* =========================================
           NORMAL COMMUNITY POST
        ========================================= */

        if (image) {
          formData.append(
            "image",
            image
          );
        }

        await api.post(
          "/community/posts/",
          formData
        );
      }

      await queryClient.invalidateQueries({
        queryKey: ["community-posts"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      navigate("/");
    } catch (err: any) {
      console.error(
        "Failed to create community post:",
        err
      );

      const responseData =
        err?.response?.data;

      if (
        responseData &&
        typeof responseData === "object"
      ) {
        const firstError =
          Object.values(responseData)
            .flat()
            .find(
              (value) =>
                typeof value === "string"
            );

        if (firstError) {
          setError(
            firstError as string
          );
          return;
        }
      }

      setError(
        postType === "for_sale"
          ? "We couldn't create your marketplace listing. Please check your details and try again."
          : "We couldn't publish your post. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================================
     PROFILE COMPLETION GATE
  ========================================= */

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

  /* =========================================
     LOADING PROFILE
  ========================================= */

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

          {/* ========================================= */}
          {/* POST CONTENT */}
          {/* ========================================= */}

          <div className="p-5 sm:p-6">

            <div className="flex items-start gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                {postType === "for_sale" ? (
                  <ShoppingBag size={20} />
                ) : (
                  <Leaf size={20} />
                )}
              </div>

              <div className="min-w-0 flex-1">

                <label
                  htmlFor="post-content"
                  className="text-sm font-bold text-gray-900"
                >
                  {postType === "for_sale"
                    ? "Tell the community about what you're selling"
                    : postType === "service"
                    ? "Tell the community about your service"
                    : "What is happening in agriculture?"}
                </label>

                <textarea
                  id="post-content"
                  value={content}
                  onChange={(event) =>
                    setContent(
                      event.target.value
                    )
                  }
                  placeholder={
                    postType === "for_sale"
                      ? "Describe your offer, availability, location or any important details..."
                      : postType === "service"
                      ? "Describe the service you offer and how it can help other members..."
                      : "Share an update, ask a question, share knowledge or start a discussion..."
                  }
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

          {/* ========================================= */}
          {/* POST TYPE */}
          {/* ========================================= */}

          <div className="border-t border-gray-100 px-5 py-5 sm:px-6">

            <label className="text-sm font-bold text-gray-900">
              Post type
            </label>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">

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
                {
                  value: "for_sale",
                  label: "For Sale",
                },
                {
                  value: "service",
                  label: "Service",
                },
              ].map((type) => (

                <button
                  key={type.value}
                  type="button"
                  onClick={() =>
                    handlePostTypeChange(
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

          {/* ========================================= */}
          {/* FOR SALE PRODUCT DETAILS */}
          {/* ========================================= */}

          {postType === "for_sale" && (
            <div className="border-t border-gray-100 bg-green-50/40 px-5 py-5 sm:px-6">

              <div className="mb-5">
                <div className="flex items-center gap-2">
                  <ShoppingBag
                    size={18}
                    className="text-green-700"
                  />

                  <h2 className="text-sm font-black text-gray-900">
                    Marketplace Listing
                  </h2>
                </div>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Your listing will also be created in the AgricWise marketplace.
                </p>
              </div>

              {/* PRODUCT NAME */}

              <div>
                <label
                  htmlFor="product-name"
                  className="text-sm font-bold text-gray-900"
                >
                  Product name
                </label>

                <input
                  id="product-name"
                  type="text"
                  value={productName}
                  onChange={(event) =>
                    setProductName(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Fresh Maize"
                  maxLength={200}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* CATEGORY */}

              <div className="mt-4">
                <label
                  htmlFor="product-category"
                  className="text-sm font-bold text-gray-900"
                >
                  Category
                </label>

                <select
                  id="product-category"
                  value={category}
                  onChange={(event) =>
                    setCategory(
                      event.target.value
                    )
                  }
                  disabled={isLoadingCategories}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                >
                  <option value="">
                    {isLoadingCategories
                      ? "Loading categories..."
                      : "Select a category"}
                  </option>

                  {categories.map(
                    (item) => (
                      <option
                        key={item.id}
                        value={item.id}
                      >
                        {item.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* DESCRIPTION */}

              <div className="mt-4">
                <label
                  htmlFor="product-description"
                  className="text-sm font-bold text-gray-900"
                >
                  Product description
                </label>

                <textarea
                  id="product-description"
                  value={productDescription}
                  onChange={(event) =>
                    setProductDescription(
                      event.target.value
                    )
                  }
                  placeholder="Describe the product, quality, condition, availability and other useful details..."
                  rows={4}
                  className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* PRICE / QUANTITY */}

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label
                    htmlFor="product-price"
                    className="text-sm font-bold text-gray-900"
                  >
                    Price (₦)
                  </label>

                  <input
                    id="product-price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={price}
                    onChange={(event) =>
                      setPrice(
                        event.target.value
                      )
                    }
                    placeholder="e.g. 50000"
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="product-quantity"
                    className="text-sm font-bold text-gray-900"
                  >
                    Quantity
                  </label>

                  <input
                    id="product-quantity"
                    type="number"
                    min="1"
                    step="1"
                    value={quantity}
                    onChange={(event) =>
                      setQuantity(
                        event.target.value
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />
                </div>

              </div>

              {/* UNIT */}

              <div className="mt-4">
                <label
                  htmlFor="product-unit"
                  className="text-sm font-bold text-gray-900"
                >
                  Unit
                </label>

                <select
                  id="product-unit"
                  value={unit}
                  onChange={(event) =>
                    setUnit(
                      event.target.value
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                >
                  <option value="kg">
                    Kilogram
                  </option>

                  <option value="bag">
                    Bag
                  </option>

                  <option value="basket">
                    Basket
                  </option>

                  <option value="crate">
                    Crate
                  </option>

                  <option value="bunch">
                    Bunch
                  </option>

                  <option value="piece">
                    Piece
                  </option>

                  <option value="ton">
                    Ton
                  </option>
                </select>
              </div>

            </div>
          )}

          {/* ========================================= */}
          {/* LOCATION */}
          {/* ========================================= */}

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
                setLocation(
                  event.target.value
                )
              }
              placeholder="e.g. Abeokuta, Ogun State"
              maxLength={255}
              className="mt-3 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
            />

          </div>

          {/* ========================================= */}
          {/* IMAGE */}
          {/* ========================================= */}

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
                    {postType === "for_sale"
                      ? "Product image"
                      : "Add an image"}
                  </span>

                  <span className="block text-xs text-gray-500">
                    {postType === "for_sale"
                      ? "Add a clear photo of the product"
                      : "Share a photo with the community"}
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

          {/* ========================================= */}
          {/* ERROR */}
          {/* ========================================= */}

          {error && (
            <div className="mx-5 mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 sm:mx-6">
              {error}
            </div>
          )}

          {/* ========================================= */}
          {/* SUBMIT */}
          {/* ========================================= */}

          <div className="border-t border-gray-100 bg-gray-50 px-5 py-4 sm:px-6">

            <button
              type="submit"
              disabled={
                isSubmitting ||
                (postType === "for_sale" &&
                  isLoadingCategories)
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {postType === "for_sale" ? (
                <ShoppingBag size={17} />
              ) : (
                <Send size={17} />
              )}

              {isSubmitting
                ? postType === "for_sale"
                  ? "Creating Listing..."
                  : "Publishing..."
                : postType === "for_sale"
                ? "Create Listing"
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