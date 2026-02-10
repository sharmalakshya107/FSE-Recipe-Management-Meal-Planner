import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LogOut, User, Bell, Search, Menu, ChefHat } from "lucide-react";
import { RootState } from "../../app/store";
import { logout } from "../../app/store/authSlice";
import { useLogoutMutation } from "../../services/api/authApi";
import { ROUTES } from "../../config/routes";
import { motion } from "framer-motion";
import { useToast } from "../../components/feedback/Toast";

export const Header: React.FC<{ onMenuClick: () => void }> = ({
  onMenuClick,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [logoutMutation] = useLogoutMutation();
  const { addToast } = useToast();

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (err) {
      addToast("Failed to logout completely", "error");
    } finally {
      dispatch(logout());
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 fixed top-0 left-0 right-0 z-40 px-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
        <Link to={ROUTES.DASHBOARD} className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <ChefHat size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 hidden sm:block">
            Recipe<span className="text-indigo-600">Planner</span>
          </span>
        </Link>
      </div>

      <div className="flex-1 max-w-lg mx-8 hidden md:block">
        {/* Global search removed as per user request */}
      </div>

      <div className="flex items-center space-x-4">
        <div className="h-6 w-px bg-gray-100 hidden sm:block mx-1"></div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold text-gray-900 leading-none">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">
              Member
            </p>
          </div>

          <div className="group relative">
            <button className="w-10 h-10 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-all">
              <User size={20} />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 z-50">
              <Link
                to={ROUTES.PROFILE}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User size={14} />
                <span>Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
