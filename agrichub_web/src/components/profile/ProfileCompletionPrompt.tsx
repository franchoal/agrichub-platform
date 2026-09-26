import { Link } from "react-router-dom";
import { UserRound } from "lucide-react";

interface ProfileCompletionPromptProps {
  onClose: () => void;
}

const ProfileCompletionPrompt = ({
  onClose,
}: ProfileCompletionPromptProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700">
          <UserRound size={25} />
        </div>

        <h2 className="mt-5 text-center text-xl font-black text-gray-900">
          Complete your profile
        </h2>

        <p className="mt-3 text-center text-sm leading-6 text-gray-600">
          Please complete your profile before participating
          in the AgricWise community.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-50"
          >
            Maybe later
          </button>

          <Link
            to="/profile"
            onClick={onClose}
            className="flex-1 rounded-xl bg-green-700 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-green-800"
          >
            Complete Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionPrompt;