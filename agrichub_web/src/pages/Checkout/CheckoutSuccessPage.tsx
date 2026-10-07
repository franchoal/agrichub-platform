import { Link, useLocation, Navigate } from "react-router-dom";
import {
  CheckCircle2,
  CreditCard,
  PackageCheck,
  Truck,
  ArrowRight,
} from "lucide-react";

import { Card, Button } from "../../components/ui";

import type {
  CheckoutResponse,
} from "../../services/orderService";

const CheckoutSuccessPage = () => {
  const location = useLocation();

  const checkoutResponse =
    location.state as CheckoutResponse | undefined;

  if (!checkoutResponse?.orders?.length) {
    return <Navigate to="/orders" replace />;
  }

  const orders = checkoutResponse.orders;

  const paymentMethodLabel = (
    method: "card" | "bank_transfer"
  ) => {
    if (method === "bank_transfer") {
      return "Bank Transfer";
    }

    return "Card";
  };

  const paymentStatusLabel = (
    status:
      | "pending"
      | "successful"
      | "failed"
      | "refunded"
  ) => {
    switch (status) {
      case "successful":
        return "Successful";

      case "failed":
        return "Failed";

      case "refunded":
        return "Refunded";

      default:
        return "Pending";
    }
  };

  const deliveryStatusLabel = (
    status:
      | "pending"
      | "assigned"
      | "picked_up"
      | "in_transit"
      | "delivered"
  ) => {
    switch (status) {
      case "assigned":
        return "Assigned";

      case "picked_up":
        return "Picked Up";

      case "in_transit":
        return "In Transit";

      case "delivered":
        return "Delivered";

      default:
        return "Pending";
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">

      {/* Success Hero */}

      <section className="rounded-[24px] bg-gradient-to-r from-green-700 via-green-600 to-green-500 p-6 text-white shadow-xl sm:rounded-[30px] sm:p-8 lg:rounded-[32px] lg:p-10">

        <div className="flex flex-col items-center text-center">

          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur sm:h-20 sm:w-20">

            <CheckCircle2
              size={38}
              className="text-white sm:h-[46px] sm:w-[46px]"
            />

          </div>

          <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:mt-6 sm:text-4xl lg:text-5xl">
            Order Created Successfully
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-green-50 sm:mt-4 sm:text-lg sm:leading-8">
            Thank you for your purchase. Your order has been
            created and is now awaiting payment.
          </p>

        </div>

      </section>

      {/* Checkout Message */}

      <Card className="mt-6 rounded-[24px] border-green-100 bg-green-50 p-4 sm:mt-8 sm:rounded-[30px] sm:p-6">

        <div className="flex items-start gap-3 sm:gap-4">

          <PackageCheck
            size={24}
            className="mt-0.5 shrink-0 text-green-700 sm:mt-1 sm:h-7 sm:w-7"
          />

          <div className="min-w-0">

            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
              {checkoutResponse.message}
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
              Your cart has been cleared and your order records
              have been created. Each farmer&apos;s portion of the
              purchase is shown below.
            </p>

          </div>

        </div>

      </Card>

      {/* Orders */}

      <section className="mt-8 space-y-6 sm:mt-10 sm:space-y-8">

        <div>

          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Your Orders
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
            {orders.length === 1
              ? "Your checkout created one order."
              : `Your checkout created ${orders.length} separate orders because your products came from different farmers.`}
          </p>

        </div>

        {orders.map((result) => {

          const {
            order,
            payment,
            delivery,
          } = result;

          return (
            <Card
              key={order.id}
              className="rounded-[24px] p-5 shadow-sm sm:rounded-[30px] sm:p-8"
            >

              {/* Order Header */}

              <div className="flex flex-col gap-4 border-b pb-5 sm:gap-5 sm:pb-6 md:flex-row md:items-center md:justify-between">

                <div>

                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500 sm:text-sm">
                    Order
                  </p>

                  <h3 className="mt-1 text-2xl font-extrabold text-gray-900 sm:text-3xl">
                    #{order.id}
                  </h3>

                </div>

                <div className="w-fit rounded-full bg-yellow-50 px-3 py-1.5 text-xs font-semibold text-yellow-700 sm:px-4 sm:py-2 sm:text-sm">
                  {order.status}
                </div>

              </div>

              {/* Order Information */}

              <div className="mt-5 grid gap-3 sm:mt-6 sm:gap-4 md:grid-cols-3">

                <div className="min-w-0 rounded-2xl bg-gray-50 p-4 sm:p-5">

                  <p className="text-sm text-gray-500">
                    Farmer
                  </p>

                  <p className="mt-2 break-words font-bold text-gray-900">
                    {order.farmer}
                  </p>

                </div>

                <div className="rounded-2xl bg-gray-50 p-4 sm:p-5">

                  <p className="text-sm text-gray-500">
                    Products
                  </p>

                  <p className="mt-2 font-bold text-gray-900">
                    {order.items.length}
                  </p>

                </div>

                <div className="rounded-2xl bg-gray-50 p-4 sm:p-5">

                  <p className="text-sm text-gray-500">
                    Order Total
                  </p>

                  <p className="mt-2 text-lg font-extrabold text-green-700 sm:text-xl">
                    ₦
                    {Number(
                      order.total
                    ).toLocaleString()}
                  </p>

                </div>

              </div>

              {/* Payment */}

              <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 sm:mt-6 sm:p-6">

                <div className="flex items-start gap-3 sm:gap-4">

                  <div className="shrink-0 rounded-xl bg-white p-2.5 sm:p-3">

                    <CreditCard
                      size={22}
                      className="text-blue-700 sm:h-6 sm:w-6"
                    />

                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                      <div className="min-w-0">

                        <h4 className="font-bold text-gray-900">
                          Payment
                        </h4>

                        <p className="mt-1 text-sm text-gray-500">
                          Payment #{payment.id}
                        </p>

                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1 text-xs font-semibold sm:text-sm ${
                          payment.status ===
                          "successful"
                            ? "bg-green-100 text-green-700"
                            : payment.status ===
                              "failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {paymentStatusLabel(
                          payment.status
                        )}
                      </span>

                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4">

                      <div>

                        <p className="text-sm text-gray-500">
                          Method
                        </p>

                        <p className="mt-1 font-semibold text-gray-900">
                          {paymentMethodLabel(
                            payment.method
                          )}
                        </p>

                      </div>

                      <div>

                        <p className="text-sm text-gray-500">
                          Amount
                        </p>

                        <p className="mt-1 font-semibold text-gray-900">
                          ₦
                          {Number(
                            payment.amount
                          ).toLocaleString()}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

              {/* Delivery */}

              <div className="mt-5 rounded-2xl border border-purple-100 bg-purple-50 p-4 sm:mt-6 sm:p-6">

                <div className="flex items-start gap-3 sm:gap-4">

                  <div className="shrink-0 rounded-xl bg-white p-2.5 sm:p-3">

                    <Truck
                      size={22}
                      className="text-purple-700 sm:h-6 sm:w-6"
                    />

                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                      <div className="min-w-0">

                        <h4 className="font-bold text-gray-900">
                          Delivery
                        </h4>

                        <p className="mt-1 text-sm text-gray-500">
                          Delivery #{delivery.id}
                        </p>

                      </div>

                      <span className="w-fit rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700 sm:text-sm">
                        {deliveryStatusLabel(
                          delivery.status
                        )}
                      </span>

                    </div>

                    <div className="mt-4">

                      <p className="text-sm text-gray-500">
                        Delivery Address
                      </p>

                      <p className="mt-1 break-words font-semibold leading-6 text-gray-900">
                        {delivery.address}
                      </p>

                    </div>

                    {delivery.tracking_number && (
                      <div className="mt-4">

                        <p className="text-sm text-gray-500">
                          Tracking Number
                        </p>

                        <p className="mt-1 break-all font-semibold text-gray-900">
                          {delivery.tracking_number}
                        </p>

                      </div>
                    )}

                  </div>

                </div>

              </div>

              {/* Action */}

              <div className="mt-6 sm:mt-8">

                <Link
                  to={`/orders/${order.id}`}
                  className="block w-full"
                >

                  <Button className="flex w-full items-center justify-center gap-2">

                    View Order

                    <ArrowRight size={18} />

                  </Button>

                </Link>

              </div>

            </Card>
          );
        })}

      </section>

      {/* Bottom Actions */}

      <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:justify-center sm:gap-4">

        <Link
          to="/orders"
          className="w-full sm:w-auto"
        >

          <Button
            variant="outline"
            className="w-full sm:w-auto"
          >
            View All Orders
          </Button>

        </Link>

        <Link
          to="/products"
          className="w-full sm:w-auto"
        >

          <Button className="w-full sm:w-auto">
            Continue Shopping
          </Button>

        </Link>

      </div>

    </main>
  );
};

export default CheckoutSuccessPage;