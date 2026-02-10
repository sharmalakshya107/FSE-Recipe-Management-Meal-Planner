import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials, setAccessToken } from "../../app/store/authSlice";
import { authApi } from "../../services/api/authApi";
import { ROUTES } from "../../config/routes";
import { useToast } from "../../components/feedback/Toast";
import { Spinner } from "../../components/feedback/Spinner";

const SocialCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const triggerGetMe = authApi.endpoints.getMe.useLazyQuery()[0];
  const { addToast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token");

      if (token) {
        try {
          // Set only token first for triggerGetMe to work
          dispatch(setAccessToken(token));
          const userResult = await triggerGetMe().unwrap();

          dispatch(
            setCredentials({
              accessToken: token,
              refreshToken: "",
              user: userResult,
            }),
          );

          navigate(ROUTES.DASHBOARD);
        } catch (error) {
          addToast("Social login failed. Please try again.", "error");
          navigate(ROUTES.LOGIN);
        }
      } else {
        navigate(ROUTES.LOGIN);
      }
    };

    handleCallback();
  }, [searchParams, navigate, dispatch, triggerGetMe]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto" />
        <p className="mt-4 text-gray-600 font-medium">
          Completing social login...
        </p>
      </div>
    </div>
  );
};

export default SocialCallbackPage;
