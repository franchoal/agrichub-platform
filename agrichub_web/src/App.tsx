import logoIcon from "./assets/logo/logo-icon.png";

function App() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F8FCF5] via-white to-[#EEF8E9] flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">

        {/* AGRICWISE LOGO */}

        <img
          src={logoIcon}
          alt="AgricWise"
          className="mx-auto h-24 w-24 object-contain"
        />

        <h1 className="mt-4 text-4xl font-black tracking-tight text-green-800">
          AgricWise
        </h1>

        <p className="mt-2 text-base font-medium text-gray-600">
          Connecting Agriculture. Empowering Communities.
        </p>

        <div className="mt-8 rounded-2xl bg-green-50 px-5 py-4">
          <p className="text-sm font-semibold text-green-800">
            Welcome to AgricWise
          </p>

          <p className="mt-1 text-xs leading-5 text-gray-600">
            A growing community for farmers, buyers,
            agricultural businesses and everyone
            connected to agriculture.
          </p>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          AgricWise Africa
        </p>

      </div>
    </main>
  );
}

export default App;