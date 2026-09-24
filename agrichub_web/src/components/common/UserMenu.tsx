import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const UserMenu = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  if (!user) return null;

  const displayName =
    [user.first_name, user.last_name]
      .filter(Boolean)
      .join(" ") || user.email;

  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="font-medium">{displayName}</p>
        <p className="text-sm text-gray-500">
          {user.email}
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default UserMenu;