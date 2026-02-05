import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "./ProtectedRoute";
import { MainLayout } from "../components/layout/MainLayout";
import { ROUTES } from "../config/routes";

const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const SocialCallbackPage = lazy(
  () => import("../pages/auth/SocialCallbackPage"),
);

const ForgotPasswordPage = lazy(
  () => import("../pages/auth/ForgotPasswordPage"),
);
const ResetPasswordPage = lazy(() => import("../pages/auth/ResetPasswordPage"));
const VerifyEmailPage = lazy(() => import("../pages/auth/VerifyEmailPage"));

const DashboardPage = lazy(() => import("../pages/dashboard/DashboardPage"));
const RecipesPage = lazy(() => import("../pages/recipes/RecipesPage"));
const MealPlannerPage = lazy(
  () => import("../pages/meal-planner/MealPlannerPage"),
);
const InventoryPage = lazy(() => import("../pages/inventory/InventoryPage"));
const ShoppingListPage = lazy(
  () => import("../pages/shopping-list/ShoppingListPage"),
);
const NutritionPage = lazy(() => import("../pages/nutrition/NutritionPage"));
const HouseholdPage = lazy(() => import("../pages/household/HouseholdPage"));
const ProfilePage = lazy(() => import("../pages/profile/ProfilePage"));
const SharedRecipePage = lazy(
  () => import("../pages/recipes/SharedRecipePage"),
);

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50">
    <div className="w-12 h-12 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
  {
    path: ROUTES.LOGIN,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.REGISTER,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <RegisterPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.SOCIAL_CALLBACK,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <SocialCallbackPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ForgotPasswordPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.RESET_PASSWORD,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ResetPasswordPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.VERIFY_EMAIL,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <VerifyEmailPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.SHARED_RECIPE,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <SharedRecipePage />
      </Suspense>
    ),
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: ROUTES.DASHBOARD,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <DashboardPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.RECIPES,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <RecipesPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.MEAL_PLANNER,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <MealPlannerPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.INVENTORY,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <InventoryPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.SHOPPING_LIST,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <ShoppingListPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.NUTRITION,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <NutritionPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.HOUSEHOLD,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <HouseholdPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.PROFILE,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <ProfilePage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);
