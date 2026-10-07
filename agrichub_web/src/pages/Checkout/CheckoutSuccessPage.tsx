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
    <main className="mx-auto max-w-6xl px-6 py-12">

      {/* Success Hero */}

      <section className="rounded-[32px] bg-gradient-to-r from-green-700 via-green-600 to-green-500 p-10 text-white shadow-xl">

        <div className="flex flex-col items-center text-center">

          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur">

            <CheckCircle2
              size={46}
              className="text-white"
            />

          </div>

          <h1 className="mt-6 text-4xl font-extrabold md:text-5xl">
            Order Created Successfully
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-green-50">
            Thank you for your purchase. Your order has been
            created and is now awaiting payment.
          </p>

        </div>

      </section>

      {/* Checkout Message */}

      <Card className="mt-8 rounded-[30px] border-green-100 bg-green-50 p-6">

        <div className="flex items-start gap-4">

          <PackageCheck
            size={28}
            className="mt-1 shrink-0 text-green-700"
          />

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              {checkoutResponse.message}
            </h2>

            <p className="mt-2 leading-7 text-gray-600">
              Your cart has been cleared and your order records
              have been created. Each farmer's portion of the
              purchase is shown below.
            </p>

          </div>

        </div>

      </Card>

      {/* Orders */}

      <section className="mt-10 space-y-8">

        <div>

          <h2 className="text-3xl font-bold text-gray-900">
            Your Orders
          </h2>

          <p className="mt-2 text-gray-500">
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
              className="rounded-[30px] p-8 shadow-sm"
            >

              {/* Order Header */}

              <div className="flex flex-col justify-between gap-5 border-b pb-6 md:flex-row md:items-center">

                <div>

                  <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
                    Order
                  </p>

                  <h3 className="mt-1 text-3xl font-extrabold text-gray-900">
                    #{order.id}
                  </h3>

                </div>

                <div className="rounded-full bg-yellow-50 px-4 py-2 text-sm font-semibold text-yellow-700">
                  {order.status}
                </div>

              </div>

              {/* Order Information */}

              <div className="mt-6 grid gap-4 md:grid-cols-3">

                <div className="rounded-2xl bg-gray-50 p-5">

                  <p className="text-sm text-gray-500">
                    Farmer
                  </p>

                  <p className="mt-2 font-bold text-gray-900">
                    {order.farmer}
                  </p>

                </div>

                <div className="rounded-2xl bg-gray-50 p-5">

                  <p className="text-sm text-gray-500">
                    Products
                  </p>

                  <p className="mt-2 font-bold text-gray-900">
                    {order.items.length}
                  </p>

                </div>

                <div className="rounded-2xl bg-gray-50 p-5">

                  <p className="text-sm text-gray-500">
                    Order Total
                  </p>

                  <p className="mt-2 text-xl font-extrabold text-green-700">
                    ₦
                    {Number(
                      order.total
                    ).toLocaleString()}
                  </p>

                </div>

              </div>

              {/* Payment */}

              <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-6">

                <div className="flex items-start gap-4">

                  <div className="rounded-xl bg-white p-3">

                    <CreditCard
                      size={24}
                      className="text-blue-700"
                    />

                  </div>

                  <div className="flex-1">

                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">

                      <div>

                        <h4 className="font-bold text-gray-900">
                          Payment
                        </h4>

                        <p className="mt-1 text-sm text-gray-500">
                          Payment #{payment.id}
                        </p>

                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1 text-sm font-semibold ${
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

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">

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

              <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50 p-6">

                <div className="flex items-start gap-4">

                  <div className="rounded-xl bg-white p-3">

                    <Truck
                      size={24}
                      className="text-purple-700"
                    />

                  </div>

                  <div className="flex-1">

                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">

                      <div>

                        <h4 className="font-bold text-gray-900">
                          Delivery
                        </h4>

                        <p className="mt-1 text-sm text-gray-500">
                          Delivery #{delivery.id}
                        </p>

                      </div>

                      <span className="w-fit rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
                        {deliveryStatusLabel(
                          delivery.status
                        )}
                      </span>

                    </div>

                    <div className="mt-4">

                      <p className="text-sm text-gray-500">
                        Delivery Address
                      </p>

                      <p className="mt-1 font-semibold text-gray-900">
                        {delivery.address}
                      </p>

                    </div>

                    {delivery.tracking_number && (
                      <div className="mt-4">

                        <p className="text-sm text-gray-500">
                          Tracking Number
                        </p>

                        <p className="mt-1 font-semibold text-gray-900">
                          {delivery.tracking_number}
                        </p>

                      </div>
                    )}

                  </div>

                </div>

              </div>

              {/* Action */}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <Link
                  to={`/orders/${order.id}`}
                  className="flex-1"
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

      <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

        <Link to="/orders">

          <Button
            variant="outline"
            className="w-full sm:w-auto"
          >
            View All Orders
          </Button>

        </Link>

        <Link to="/products">

          <Button className="w-full sm:w-auto">
            Continue Shopping
          </Button>

        </Link>

      </div>

    </main>
  );
};

export default CheckoutSuccessPage;