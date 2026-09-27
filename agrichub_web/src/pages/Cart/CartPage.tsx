import { Link } from "react-router-dom";

import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";

import { useCart } from "../../hooks/useCart";
import { useUpdateCartItem } from "../../hooks/useUpdateCartItem";
import { useRemoveCartItem } from "../../hooks/useRemoveCartItem";


const CartPage = () => {

  const {
    data: cart,
    isLoading,
    isError,
  } = useCart();


  const {
    mutate: updateCartItem,
  } = useUpdateCartItem();


  const {
    mutate: removeCartItem,
  } = useRemoveCartItem();



  /*
  ======================================================
  LOADING STATE
  ======================================================
  */

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-green-50 via-white to-white">

        <div className="mx-auto max-w-7xl px-6 py-20 text-center">

          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />

          <p className="mt-6 text-lg font-semibold text-gray-600">
            Loading your farm basket...
          </p>

        </div>

      </main>
    );
  }



  /*
  ======================================================
  ERROR STATE
  ======================================================
  */

  if (isError) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-green-50 via-white to-white">

        <div className="mx-auto max-w-7xl px-6 py-20 text-center">

          <div className="rounded-3xl bg-white p-10 shadow-xl">

            <h2 className="text-3xl font-bold text-red-600">
              Unable to load cart
            </h2>

            <p className="mt-4 text-gray-600">
              Something went wrong while fetching your shopping basket.
            </p>

          </div>

        </div>

      </main>
    );
  }



  if (!cart) {
    return null;
  }



  /*
  ======================================================
  MAIN PAGE
  ======================================================
  */

  return (

    <main className="min-h-screen bg-gradient-to-b from-green-50/50 via-white to-white">


      <div className="mx-auto max-w-7xl px-6 py-10">



        {/* HERO */}

        <section className="relative overflow-hidden rounded-[36px]">


          <div className="absolute inset-0 bg-gradient-to-r from-green-800 via-green-700 to-emerald-600" />


          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-20 left-10 h-60 w-60 rounded-full bg-white/10 blur-3xl" />


          <div className="relative px-10 py-16 lg:px-16">


            <span className="inline-flex rounded-full bg-white/20 px-5 py-2 text-sm font-semibold text-white backdrop-blur">

              🛒 Secure Shopping

            </span>



            <h1 className="mt-8 text-5xl font-extrabold leading-tight text-white lg:text-6xl">

              Your Farm Basket

            </h1>



            <p className="mt-6 max-w-2xl text-lg leading-8 text-green-100">

              Review your selected farm products, update quantities,
              and continue to a secure checkout experience while
              supporting verified Nigerian farmers.

            </p>



            <div className="mt-10 grid gap-5 sm:grid-cols-3">


              <div className="rounded-2xl bg-white/15 p-5 backdrop-blur">

                <p className="text-3xl font-extrabold text-white">

                  {cart.items.length}

                </p>

                <p className="mt-2 text-sm text-green-100">

                  Product
                  {cart.items.length !== 1 ? "s" : ""}

                </p>

              </div>



              <div className="rounded-2xl bg-white/15 p-5 backdrop-blur">

                <p className="text-3xl">
                  🚜
                </p>

                <p className="mt-2 text-sm text-green-100">
                  Verified Farmers
                </p>

              </div>



              <div className="rounded-2xl bg-white/15 p-5 backdrop-blur">

                <p className="text-3xl">
                  🔒
                </p>

                <p className="mt-2 text-sm text-green-100">
                  Secure Checkout
                </p>

              </div>


            </div>


          </div>


        </section>
                {/* ======================================================
            BASKET HEADER
        ====================================================== */}

        <section className="mt-10 rounded-[30px] bg-white p-8 shadow-lg">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">


            <div>

              <h2 className="text-4xl font-bold text-gray-900">

                Shopping Basket

              </h2>


              <p className="mt-3 text-lg text-gray-500">

                {cart.items.length} Item
                {cart.items.length !== 1 ? "s" : ""}
                {" "}currently selected

              </p>


            </div>



            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-2xl border border-green-600 px-7 py-4 font-semibold text-green-700 transition hover:-translate-y-1 hover:bg-green-50 hover:shadow-lg"
            >

              ← Continue Shopping

            </Link>


          </div>


        </section>




        {/* ======================================================
            EMPTY CART
        ====================================================== */}


        {cart.items.length === 0 ? (

          <section className="mt-10 overflow-hidden rounded-[34px] bg-white shadow-xl">


            <div className="px-10 py-24 text-center">


              <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-green-100 text-7xl">

                🌾

              </div>



              <h2 className="mt-10 text-5xl font-extrabold text-gray-900">

                Your Farm Basket Awaits

              </h2>



              <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-500">

                Discover fresh vegetables, fruits, grains, livestock,
                poultry and other agricultural products directly from
                verified Nigerian farmers.

              </p>




              <div className="mt-12 flex flex-wrap justify-center gap-5">


                <Link
                  to="/products"
                  className="rounded-2xl bg-green-600 px-8 py-4 font-bold text-white transition hover:-translate-y-1 hover:bg-green-700 hover:shadow-xl"
                >

                  Explore Marketplace

                </Link>



                <Link
                  to="/"
                  className="rounded-2xl border border-green-600 px-8 py-4 font-bold text-green-700 transition hover:bg-green-50"
                >

                  Return Home

                </Link>



              </div>


            </div>


          </section>



        ) : (


          <div className="mt-10 grid gap-10 lg:grid-cols-3">



            {/* ======================================================
                CART ITEMS
            ====================================================== */}


            <section className="space-y-6 lg:col-span-2">


              {cart.items.map((item) => (


                <CartItem
                  key={item.id}
                  item={item}

                  onUpdateQuantity={(id, quantity) => {

                    updateCartItem({

                      id,

                      data: {
                        quantity,
                      },

                    });

                  }}


                  onRemove={removeCartItem}

                />


              ))}


            </section>





            {/* ======================================================
                ORDER SUMMARY
            ====================================================== */}


            <aside className="lg:sticky lg:top-28 lg:self-start">


              <div className="rounded-[30px] bg-white p-7 shadow-xl">


                <h2 className="mb-6 text-2xl font-bold text-gray-900">

                  Order Summary

                </h2>



                <CartSummary
                  total={cart.total ?? 0}
                />



                <Link
                  to="/checkout"
                  className="mt-8 flex w-full items-center justify-center rounded-2xl bg-green-600 px-6 py-4 font-bold text-white transition hover:-translate-y-1 hover:bg-green-700 hover:shadow-xl"
                >

                  Proceed To Checkout

                </Link>



                <p className="mt-5 text-center text-sm text-gray-500">

                  🔒 Secure payment and trusted delivery

                </p>


              </div>


            </aside>



          </div>


        )}





        {/* ======================================================
            CHECKOUT REASSURANCE
        ====================================================== */}


        {cart.items.length > 0 && (

          <section className="mt-16 overflow-hidden rounded-[34px] bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 text-white shadow-2xl">


            <div className="grid gap-10 p-10 lg:grid-cols-[1.5fr_1fr] lg:items-center">


              <div>


                <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur">

                  Ready For Checkout

                </span>



                <h2 className="mt-6 text-4xl font-extrabold leading-tight lg:text-5xl">

                  Fresh Produce.
                  <br />
                  Trusted Farmers.
                  <br />
                  Secure Ordering.

                </h2>



                <p className="mt-6 max-w-3xl text-lg leading-8 text-green-100">

                  AgricWise connects buyers directly with verified farmers,
                  creating a transparent agricultural marketplace built
                  around quality, trust and fair pricing.

                </p>


              </div>





              <div className="rounded-[28px] bg-white/15 p-8 backdrop-blur">


                <h3 className="text-2xl font-bold">

                  Why AgricWise?

                </h3>



                <div className="mt-6 space-y-4 text-green-100">


                  <div className="flex items-center gap-3">

                    🌾

                    Farm Fresh Produce

                  </div>



                  <div className="flex items-center gap-3">

                    🚜

                    Verified Farmers

                  </div>



                  <div className="flex items-center gap-3">

                    📦

                    Transparent Pricing

                  </div>



                  <div className="flex items-center gap-3">

                    🔒

                    Secure Checkout

                  </div>



                </div>


              </div>



            </div>


          </section>


        )}






        {/* ======================================================
            FARMER IMPACT
        ====================================================== */}



        <section className="mt-12 rounded-[30px] bg-white p-10 shadow-xl">


          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">



            <div>


              <h2 className="text-3xl font-bold text-gray-900">

                Every Purchase Makes A Difference

              </h2>



              <p className="mt-5 leading-8 text-gray-600">

                Your order does more than buy food.
                It helps Nigerian farmers reach customers,
                reduce waste and grow sustainable businesses.

              </p>


            </div>





            <div className="grid gap-5 sm:grid-cols-2">



              <div className="rounded-3xl bg-green-50 p-6">


                <div className="text-3xl">

                  👨🏾‍🌾

                </div>



                <h3 className="mt-4 font-bold text-green-700">

                  Empower Farmers

                </h3>



                <p className="mt-2 text-sm leading-6 text-gray-600">

                  Support local agriculture and farmer growth.

                </p>


              </div>





              <div className="rounded-3xl bg-amber-50 p-6">


                <div className="text-3xl">

                  🥬

                </div>



                <h3 className="mt-4 font-bold text-amber-700">

                  Fresh Food

                </h3>



                <p className="mt-2 text-sm leading-6 text-gray-600">

                  Access quality produce from trusted sources.

                </p>


              </div>



            </div>



          </div>


        </section>



      </div>


    </main>

  );

};


export default CartPage;
