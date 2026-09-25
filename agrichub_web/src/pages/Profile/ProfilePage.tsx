import {
  useEffect,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  Check,
  Edit3,
  MapPin,
  MessageCircle,
  Save,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import {
  getProfile,
  updateProfile,
  type UserProfile,
} from "../../services/profileService";

import {
  acceptConnectionRequest,
  getConnectionRequests,
  getConnections,
  rejectConnectionRequest,
  type CommunityConnection,
} from "../../services/communityService";

const ProfilePage = () => {
  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [connections, setConnections] = useState<
    CommunityConnection[]
  >([]);

  const [requests, setRequests] = useState<
    CommunityConnection[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    location: "",
    bio: "",
  });

  const [selectedPhoto, setSelectedPhoto] =
    useState<File | null>(null);

  const photoInputRef =
    useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [
          profileResponse,
          connectionsResponse,
          requestsResponse,
        ] = await Promise.all([
          getProfile(),
          getConnections(),
          getConnectionRequests(),
        ]);

        setProfile(profileResponse);
        setConnections(connectionsResponse.results);
        setRequests(requestsResponse.results);

        setForm({
          first_name: profileResponse.first_name || "",
          last_name: profileResponse.last_name || "",
          phone_number:
            profileResponse.phone_number || "",
          location: profileResponse.location || "",
          bio: profileResponse.bio || "",
        });
      } catch (err) {
        console.error(
          "Failed to load profile:",
          err
        );

        setError(
          "We couldn't load your profile. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const fullName = profile
    ? `${profile.first_name} ${profile.last_name}`.trim()
    : "AgricWise Member";

  const initials =
    `${profile?.first_name?.charAt(0) || ""}${profile?.last_name?.charAt(0) || ""}`
      .toUpperCase() || "A";

  const profileIsComplete = Boolean(
    profile?.location?.trim() &&
      profile?.bio?.trim()
  );

  const formIsComplete = Boolean(
    form.location.trim() &&
      form.bio.trim()
  );

  const handlePhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Profile photo must be smaller than 5MB."
      );
      return;
    }

    setError("");
    setSelectedPhoto(file);
  };

  const getPhotoPreview = () => {
    if (selectedPhoto) {
      return URL.createObjectURL(selectedPhoto);
    }

    return profile?.photo || null;
  };

  const handleSave = async () => {
    if (!form.location.trim()) {
      setError(
        "Location is required to complete your profile."
      );
      return;
    }

    if (!form.bio.trim()) {
      setError(
        "Please add a short bio to complete your profile."
      );
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      const updatedProfile =
        await updateProfile({
          ...form,
          location: form.location.trim(),
          bio: form.bio.trim(),
          photo: selectedPhoto,
        });

      setProfile(updatedProfile);
      setSelectedPhoto(null);
      setIsEditing(false);

      if (photoInputRef.current) {
        photoInputRef.current.value = "";
      }
    } catch (err) {
      console.error(
        "Failed to update profile:",
        err
      );

      setError(
        "We couldn't update your profile. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (!profile) {
      return;
    }

    setForm({
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      phone_number:
        profile.phone_number || "",
      location: profile.location || "",
      bio: profile.bio || "",
    });

    setSelectedPhoto(null);
    setIsEditing(false);
    setError("");

    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  };

  const handleAcceptRequest = async (
    connectionId: number
  ) => {
    try {
      const accepted =
        await acceptConnectionRequest(
          connectionId
        );

      setRequests((previous) =>
        previous.filter(
          (request) =>
            request.id !== connectionId
        )
      );

      setConnections((previous) => [
        ...previous,
        accepted,
      ]);
    } catch (err) {
      console.error(
        "Failed to accept connection request:",
        err
      );

      setError(
        "We couldn't accept the connection request."
      );
    }
  };

  const handleRejectRequest = async (
    connectionId: number
  ) => {
    try {
      await rejectConnectionRequest(
        connectionId
      );

      setRequests((previous) =>
        previous.filter(
          (request) =>
            request.id !== connectionId
        )
      );
    } catch (err) {
      console.error(
        "Failed to reject connection request:",
        err
      );

      setError(
        "We couldn't reject the connection request."
      );
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="mx-auto max-w-4xl animate-pulse">
          <div className="h-40 rounded-3xl bg-gray-200" />

          <div className="-mt-10 px-5">
            <div className="h-24 w-24 rounded-full bg-gray-300" />
          </div>

          <div className="mt-6 space-y-3 rounded-2xl bg-white p-6">
            <div className="h-5 w-48 rounded bg-gray-200" />
            <div className="h-4 w-72 rounded bg-gray-100" />
            <div className="h-20 rounded bg-gray-100" />
          </div>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">
          <Users
            className="mx-auto text-green-700"
            size={32}
          />

          <h1 className="mt-4 text-xl font-black text-gray-900">
            Profile unavailable
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {error ||
              "Please try again later."}
          </p>

          <Link
            to="/"
            className="mt-5 inline-flex rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white"
          >
            Back to AgricWise
          </Link>
        </div>
      </main>
    );
  }

  const photoPreview = getPhotoPreview();

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* HEADER */}

      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-green-700"
          >
            <ArrowLeft size={18} />
            Home
          </Link>

          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-green-800"
            >
              <Edit3 size={16} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600"
              >
                <X size={16} />
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={
                  isSaving || !formIsComplete
                }
                className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={16} />
                {isSaving
                  ? "Saving..."
                  : "Save"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mx-auto max-w-4xl px-4 pt-4">
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        </div>
      )}

      {/* PROFILE HERO */}

      <section className="mx-auto max-w-4xl px-4 pt-5">
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="h-32 bg-gradient-to-r from-green-950 via-green-800 to-green-600 sm:h-40" />

          <div className="px-5 pb-6 sm:px-7">
            <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end">
              <div className="relative h-24 w-24 shrink-0 sm:h-28 sm:w-28">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt={fullName}
                    className="h-full w-full rounded-full border-4 border-white object-cover shadow-lg"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full border-4 border-white bg-green-100 text-2xl font-black text-green-700 shadow-lg">
                    {initials}
                  </div>
                )}

                {isEditing && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        photoInputRef.current?.click()
                      }
                      className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-green-700 text-white shadow-lg"
                      aria-label="Change profile photo"
                    >
                      <Camera size={17} />
                    </button>

                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={
                        handlePhotoChange
                      }
                      className="hidden"
                    />
                  </>
                )}
              </div>

              <div className="min-w-0 flex-1 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-black text-gray-900">
                    {fullName}
                  </h1>

                  {profile.is_verified && (
                    <span
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-green-700 text-white"
                      title="Verified"
                    >
                      <Check size={13} />
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-gray-500">
                  {profile.email}
                </p>

                {profile.location && (
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                    <MapPin size={15} />
                    {profile.location}
                  </p>
                )}

                {/* PROFILE STATUS */}

                <div className="mt-3">
                  {profileIsComplete ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                      <Check size={13} />
                      Profile complete
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                      <Edit3 size={13} />
                      Complete your profile
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* CONNECTION SUMMARY */}

            <div className="mt-6 flex flex-wrap gap-6 border-t border-gray-100 pt-5">
              <div>
                <p className="text-xl font-black text-gray-900">
                  {connections.length}
                </p>

                <p className="text-xs font-semibold text-gray-500">
                  Connections
                </p>
              </div>

              <div>
                <p className="text-xl font-black text-gray-900">
                  {requests.length}
                </p>

                <p className="text-xs font-semibold text-gray-500">
                  Requests
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROFILE COMPLETION NOTICE */}

      {!profileIsComplete && !isEditing && (
        <section className="mx-auto max-w-4xl px-4 pt-5">
          <div className="rounded-2xl border border-green-100 bg-green-50 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-black text-green-900">
                  Complete your AgricWise profile
                </h2>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-green-800">
                  Add your location and a short bio before
                  participating in the AgricWise community.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setIsEditing(true)
                }
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-green-800"
              >
                <Edit3 size={16} />
                Complete Profile
              </button>
            </div>
          </div>
        </section>
      )}

      {/* PROFILE DETAILS */}

      <section className="mx-auto max-w-4xl px-4 pt-5">
        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-black text-gray-900">
                About
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Tell the AgricWise community who you are.
              </p>
            </div>

            <span className="text-xs font-semibold text-green-700">
              Personal Profile
            </span>
          </div>

          {isEditing ? (
            <div className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-gray-600">
                    First name
                  </label>

                  <input
                    value={form.first_name}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        first_name:
                          event.target.value,
                      }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600">
                    Last name
                  </label>

                  <input
                    value={form.last_name}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        last_name:
                          event.target.value,
                      }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600">
                  Phone number
                </label>

                <input
                  value={form.phone_number}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      phone_number:
                        event.target.value,
                    }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600">
                  Location{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  value={form.location}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      location:
                        event.target.value,
                    }))
                  }
                  placeholder="City, state or region"
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />

                <p className="mt-1.5 text-xs text-gray-400">
                  Your location helps people discover and
                  connect with relevant members.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600">
                  Bio{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <textarea
                  rows={4}
                  value={form.bio}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      bio: event.target.value,
                    }))
                  }
                  placeholder="Tell the AgricWise community about yourself..."
                  className="mt-1.5 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />

                <p className="mt-1.5 text-xs text-gray-400">
                  A short introduction helps other members
                  know who they are connecting with.
                </p>
              </div>

              {!formIsComplete && (
                <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs font-semibold leading-5 text-amber-800">
                  Location and bio are required before you
                  can participate in the AgricWise community.
                </div>
              )}
            </div>
          ) : (
            <div className="mt-4">
              {profile.bio ? (
                <p className="whitespace-pre-wrap text-sm leading-7 text-gray-600">
                  {profile.bio}
                </p>
              ) : (
                <p className="text-sm text-gray-400">
                  Add a short bio so people in AgricWise can
                  know more about you.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CONNECTION REQUESTS */}

      {requests.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 pt-5">
          <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
                <UserPlus size={19} />
              </div>

              <div>
                <h2 className="font-black text-gray-900">
                  Connection Requests
                </h2>

                <p className="text-xs text-gray-500">
                  Older connection requests awaiting a response.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="flex flex-col gap-3 rounded-xl bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {request.follower_name ||
                        "AgricWise Member"}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      wants to connect with you
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleAcceptRequest(
                          request.id
                        )
                      }
                      className="rounded-lg bg-green-700 px-4 py-2 text-xs font-bold text-white"
                    >
                      Accept
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleRejectRequest(
                          request.id
                        )
                      }
                      className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CONNECTIONS */}

      <section className="mx-auto max-w-4xl px-4 pt-5">
        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-black text-gray-900">
                Your Connections
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                People you are connected with on AgricWise.
              </p>
            </div>

            <Users
              size={20}
              className="text-green-700"
            />
          </div>

          {connections.length > 0 ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {connections.map((connection) => {
                const otherUser =
                  connection.follower === profile.id
                    ? connection.following_name
                    : connection.follower_name;

                return (
                  <div
                    key={connection.id}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 p-3"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-black text-green-700">
                      {otherUser
                        ?.charAt(0)
                        .toUpperCase() || "A"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-gray-900">
                        {otherUser ||
                          "AgricWise Member"}
                      </p>

                      <p className="text-xs text-green-700">
                        Connected
                      </p>
                    </div>

                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-gray-500 hover:bg-green-50 hover:text-green-700"
                      aria-label={`Message ${otherUser}`}
                    >
                      <MessageCircle size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed border-gray-200 p-6 text-center">
              <Users
                size={24}
                className="mx-auto text-gray-300"
              />

              <p className="mt-3 text-sm font-semibold text-gray-600">
                You don't have any connections yet.
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Connect with people from the AgricWise community.
              </p>

              <Link
                to="/"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-xs font-bold text-white"
              >
                Discover People
                <UserPlus size={15} />
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default ProfilePage;