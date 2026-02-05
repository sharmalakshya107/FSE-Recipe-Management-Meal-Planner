import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  ShoppingCart,
  Package,
  PieChart,
  Users,
  Settings,
  HelpCircle,
  X,
  ChefHat,
} from "lucide-react";
import { ROUTES } from "../../config/routes";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: ROUTES.DASHBOARD },
  { icon: BookOpen, label: "Recipes", path: "/recipes" },
  { icon: Calendar, label: "Meal Planner", path: "/meal-planner" },
  { icon: Package, label: "Inventory", path: "/inventory" },
  { icon: ShoppingCart, label: "Shopping List", path: "/shopping-list" },
  { icon: PieChart, label: "Nutrition", path: "/nutrition" },
  { icon: Users, label: "Household", path: "/household" },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-gray-100 transition-transform lg:translate-x-0 lg:top-16 ${
          isOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 lg:hidden border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <ChefHat size={18} />
              </div>
              <span className="text-lg font-bold text-gray-900">Menu</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <X size={18} />
            </button>
          </div>

          <div className="px-4 py-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 ml-2">
              Main Menu
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose()}
                  className={({ isActive }) => `
                    flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all
                    ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-gray-500 hover:bg-gray-50 hover:text-indigo-600"
                    }
                  `}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-4 space-y-1 border-t border-gray-100 bg-gray-50/50">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 ml-2">
              Other
            </p>
            <button className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all text-left">
              <HelpCircle size={18} />
              <span>Support</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
