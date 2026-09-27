import {
  Bell,
  BellRing,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  Card,
  Button,
} from "../../components/ui";

import {
  useNotifications,
} from "../../hooks/useNotifications";

import {
  notificationService,
} from "../../services/notificationService";

const NotificationsPage = () => {

  const queryClient = useQueryClient();

  const {
    data: notifications,
    isLoading,
    isError,
  } = useNotifications();

  const notificationList =
    notifications?.results ?? [];

  const unreadCount =
    notificationList.filter(
      (notification) =>
        !notification.is_read
    ).length;

  const markReadMutation =
    useMutation({

      mutationFn: (
        id: number
      ) =>
        notificationService.markNotificationRead(
          id
        ),

      onSuccess: () => {

        queryClient.invalidateQueries({
          queryKey: [
            "notifications",
          ],
        });

      },

    });

  const markAllMutation =
    useMutation({

      mutationFn:
        notificationService.markAllNotificationsRead,

      onSuccess: () => {

        queryClient.invalidateQueries({
          queryKey: [
            "notifications",
          ],
        });

      },

    });

  if (isLoading) {

    return (

      <main className="mx-auto max-w-7xl px-6 py-12">

        <div className="space-y-6">

          <div className="h-14 w-72 animate-pulse rounded-xl bg-gray-200" />

          {[1, 2, 3].map((item) => (

            <div
              key={item}
              className="h-36 animate-pulse rounded-[30px] bg-gray-100"
            />

          ))}

        </div>

      </main>

    );

  }

  if (isError) {

    return (

      <main className="mx-auto max-w-6xl px-6 py-12">

        <Card className="rounded-[30px] border-red-200 bg-red-50 p-10">

          <h2 className="text-3xl font-bold text-red-700">

            Unable to Load Notifications

          </h2>

          <p className="mt-4 text-red-600">

            Please try again later.

          </p>

        </Card>

      </main>

    );

  }

  return (

    <main className="mx-auto max-w-7xl px-6 py-12">

      {/* ====================================================== */}
{/* HERO */}
{/* ====================================================== */}

<section className="relative overflow-hidden rounded-[36px]">

  {/* Background */}

  <div className="absolute inset-0 bg-gradient-to-r from-green-800 via-green-700 to-emerald-600" />

  {/* Decorative Shapes */}

  <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

  <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

  <div className="relative grid gap-10 px-10 py-16 lg:grid-cols-[1fr_340px] lg:items-center lg:px-16">

    {/* Left */}

    <div>

      <span className="inline-flex items-center rounded-full bg-white/20 px-5 py-2 text-sm font-semibold backdrop-blur">

        🔔 Notification Center

      </span>

      <h1 className="mt-8 text-5xl font-extrabold leading-tight text-white lg:text-6xl">

        Stay Connected
        <br />
        Stay Informed

      </h1>

      <p className="mt-6 max-w-3xl text-lg leading-8 text-green-100">

        Receive real-time updates about orders, payments,
        deliveries, product approvals and important account
        activities from across AgricWise Marketplace.

      </p>

    </div>

    {/* Right */}

    <div className="grid gap-5">

      <div className="rounded-[28px] bg-white/15 p-6 text-center backdrop-blur">

        <BellRing
          size={42}
          className="mx-auto mb-4 text-white"
        />

        <p className="text-5xl font-black text-white">

          {unreadCount}

        </p>

        <p className="mt-2 text-green-100">

          Unread Notifications

        </p>

      </div>

      <div className="grid grid-cols-2 gap-5">

        <div className="rounded-[24px] bg-white/15 p-5 text-center backdrop-blur">

          <p className="text-3xl font-black text-white">

            {notificationList.length}

          </p>

          <p className="mt-2 text-sm text-green-100">

            Total

          </p>

        </div>

        <div className="rounded-[24px] bg-white/15 p-5 text-center backdrop-blur">

          <p className="text-3xl font-black text-white">

            {notificationList.length - unreadCount}

          </p>

          <p className="mt-2 text-sm text-green-100">

            Read

          </p>

        </div>

      </div>

      {unreadCount > 0 && (

        <Button
          onClick={() => markAllMutation.mutate()}
          disabled={markAllMutation.isPending}
          className="rounded-2xl bg-white py-3 font-bold text-green-700 hover:bg-green-50"
        >

          {markAllMutation.isPending
            ? "Updating..."
            : "✓ Mark All As Read"}

        </Button>

      )}

    </div>

  </div>

</section>
      {/* Empty State */}

      {notificationList.length === 0 ? (

        <Card className="rounded-[32px] p-20 text-center shadow-lg">

          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-green-100">

            <Bell
              size={56}
              className="text-green-700"
            />

          </div>

          <h2 className="mt-8 text-4xl font-bold text-gray-900">

            You're All Caught Up

          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-500">

            There are no new notifications at the moment.
            We'll notify you whenever there's important activity.

          </p>

        </Card>

      ) : (

        <div className="space-y-6">

  {notificationList.map((notification) => (

    <div
      key={notification.id}
      onClick={() => {
        if (!notification.is_read) {
          markReadMutation.mutate(notification.id);
        }
      }}
      className="group cursor-pointer"
    >

      <Card
        className={`overflow-hidden rounded-[30px] border-0 p-0 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
          notification.is_read
            ? "bg-white"
            : "ring-2 ring-green-200"
        }`}
      >

        <div className="grid gap-8 p-8 lg:grid-cols-[72px_1fr_auto]">

          {/* ====================================================== */}
          {/* ICON */}
          {/* ====================================================== */}

          <div
            className={`flex h-[72px] w-[72px] items-center justify-center rounded-3xl ${
              notification.is_read
                ? "bg-gray-100"
                : "bg-green-100"
            }`}
          >

            <BellRing
              size={34}
              className={
                notification.is_read
                  ? "text-gray-500"
                  : "text-green-700"
              }
            />

          </div>

          {/* ====================================================== */}
          {/* CONTENT */}
          {/* ====================================================== */}

          <div>

            <div className="flex flex-wrap items-center gap-3">

              <h2 className="text-2xl font-bold text-gray-900 transition group-hover:text-green-700">

                {notification.title}

              </h2>

              {!notification.is_read && (

                <span className="rounded-full bg-green-600 px-4 py-1 text-xs font-bold uppercase tracking-wide text-white">

                  New

                </span>

              )}

            </div>

            <p className="mt-4 max-w-3xl leading-8 text-gray-600">

              {notification.message}

            </p>

          </div>

          {/* ====================================================== */}
          {/* META */}
          {/* ====================================================== */}

          <div className="flex flex-col items-end justify-between">

            <span className="rounded-full bg-gray-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-600">

              {notification.notification_type.replaceAll(
                "_",
                " "
              )}

            </span>

            <div className="mt-8 flex items-center gap-2 text-sm text-gray-500">

              <Clock3 size={16} />

              {new Date(
                notification.created_at
              ).toLocaleString()}

            </div>

          </div>

        </div>

        {/* ====================================================== */}
        {/* FOOTER */}
        {/* ====================================================== */}

        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-8 py-4">

          <div className="flex items-center gap-3">

            <CheckCircle2
              size={18}
              className={
                notification.is_read
                  ? "text-green-600"
                  : "text-gray-400"
              }
            />

            <span className="text-sm font-medium text-gray-600">

              {notification.is_read
                ? "Notification Read"
                : "Click to mark as read"}

            </span>

          </div>

          {!notification.is_read && (

            <span className="rounded-full bg-green-100 px-4 py-2 text-xs font-bold uppercase tracking-wide text-green-700">

              Action Required

            </span>

          )}

        </div>

      </Card>

    </div>

  ))}

</div>
      )}

    </main>

  );

};

export default NotificationsPage;
