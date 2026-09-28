import {
  Bell,
  BellRing,
  CheckCircle2,
  Clock3,
  Package,
  ShoppingBasket,
  UserRound,
} from "lucide-react";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { Card, Button } from "../../components/ui";

import { useNotifications } from "../../hooks/useNotifications";

import { notificationService } from "../../services/notificationService";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const {
    data: notifications,
    isLoading,
    isError,
  } = useNotifications();

  const notificationList = notifications?.results ?? [];

  const unreadCount = notificationList.filter(
    (notification) => !notification.is_read
  ).length;

  const markReadMutation = useMutation({
    mutationFn: (id: number) =>
      notificationService.markNotificationRead(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });

  const markAllMutation = useMutation({
    mutationFn:
      notificationService.markAllNotificationsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });

  const getNotificationIcon = (type: string) => {
    const normalizedType = type.toLowerCase();

    if (
      normalizedType.includes("order") ||
      normalizedType.includes("delivery")
    ) {
      return Package;
    }

    if (
      normalizedType.includes("product") ||
      normalizedType.includes("marketplace") ||
      normalizedType.includes("payment")
    ) {
      return ShoppingBasket;
    }

    if (
      normalizedType.includes("connection") ||
      normalizedType.includes("follow") ||
      normalizedType.includes("profile")
    ) {
      return UserRound;
    }

    return BellRing;
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
          <div className="mb-5 h-8 w-48 animate-pulse rounded-lg bg-gray-200" />

          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-3xl bg-white shadow-sm"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <Card className="rounded-3xl border-red-100 bg-red-50 p-6">
            <h2 className="text-xl font-bold text-red-700">
              Unable to Load Notifications
            </h2>

            <p className="mt-2 text-sm leading-6 text-red-600">
              Please try again later.
            </p>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 pb-10 pt-4 sm:px-6 sm:pt-8">
        {/* APP HEADER */}
        <header className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100">
              <Bell size={21} className="text-green-700" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Notifications
              </h1>

              <p className="text-xs text-gray-500">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${
                      unreadCount !== 1 ? "s" : ""
                    }`
                  : "You're all caught up"}
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <Button
              onClick={() => markAllMutation.mutate()}
              disabled={markAllMutation.isPending}
              className="rounded-xl bg-green-600 px-3 py-2 text-xs font-bold text-white hover:bg-green-700 sm:px-4"
            >
              {markAllMutation.isPending
                ? "Updating..."
                : "Mark all read"}
            </Button>
          )}
        </header>

        {/* UNREAD SUMMARY */}
        {notificationList.length > 0 && (
          <section className="mb-5 rounded-3xl bg-gradient-to-r from-green-700 to-emerald-600 p-5 text-white shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-green-100">
                  Notification Center
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Stay updated
                </h2>

                <p className="mt-1 text-sm text-green-100">
                  Orders, payments, marketplace activity and account
                  updates appear here.
                </p>
              </div>

              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/15 sm:flex">
                <BellRing size={27} />
              </div>
            </div>
          </section>
        )}

        {/* EMPTY STATE */}
        {notificationList.length === 0 ? (
          <Card className="rounded-3xl border-0 p-10 text-center shadow-sm sm:p-14">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
              <Bell
                size={38}
                className="text-green-600"
              />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-gray-900">
              You're All Caught Up
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
              There are no new notifications at the moment. We'll
              notify you whenever there's important activity.
            </p>
          </Card>
        ) : (
          <section className="space-y-3">
            {notificationList.map((notification) => {
              const NotificationIcon = getNotificationIcon(
                notification.notification_type
              );

              return (
                <div
                  key={notification.id}
                  onClick={() => {
                    if (!notification.is_read) {
                      markReadMutation.mutate(notification.id);
                    }
                  }}
                  className="cursor-pointer"
                >
                  <Card
                    className={`overflow-hidden rounded-3xl border-0 p-0 shadow-sm transition ${
                      notification.is_read
                        ? "bg-white"
                        : "bg-green-50/70 ring-1 ring-green-200"
                    }`}
                  >
                    <div className="flex gap-3 p-4 sm:gap-4 sm:p-5">
                      {/* ICON */}
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                          notification.is_read
                            ? "bg-gray-100"
                            : "bg-green-100"
                        }`}
                      >
                        <NotificationIcon
                          size={21}
                          className={
                            notification.is_read
                              ? "text-gray-500"
                              : "text-green-700"
                          }
                        />
                      </div>

                      {/* CONTENT */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h2
                              className={`text-sm font-bold leading-5 ${
                                notification.is_read
                                  ? "text-gray-800"
                                  : "text-gray-900"
                              }`}
                            >
                              {notification.title}
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-gray-600">
                              {notification.message}
                            </p>
                          </div>

                          {!notification.is_read && (
                            <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-green-600" />
                          )}
                        </div>

                        {/* META */}
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500 shadow-sm">
                            {notification.notification_type.replaceAll(
                              "_",
                              " "
                            )}
                          </span>

                          <span className="flex items-center gap-1 text-[11px] text-gray-400">
                            <Clock3 size={12} />

                            {new Date(
                              notification.created_at
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* STATUS */}
                    {!notification.is_read && (
                      <div className="flex items-center gap-2 border-t border-green-100 bg-green-100/50 px-4 py-2.5 text-[11px] font-medium text-green-700 sm:px-5">
                        <CheckCircle2 size={14} />
                        Tap to mark as read
                      </div>
                    )}
                  </Card>
                </div>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
};

export default NotificationsPage;