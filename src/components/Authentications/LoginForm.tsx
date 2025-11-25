import React, { useState, useRef, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setCredentials,
} from "../../store/Slices/AuthSlice/authSlice";
import { Role } from "./types";
import { UserIcon, UsersIcon, ChevronDownIcon } from "./Icons";
import { useLoginMutation } from "@/store/api/AuthApi";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.nativeEnum(Role, {
    required_error: "Please select a role",
  }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSwitchToSignUp: () => void;
}

const RoleSelector: React.FC<{
  selectedRole: Role;
  onRoleChange: (role: Role) => void;
  disabled?: boolean;
}> = ({ selectedRole, onRoleChange, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const roleData = {
    [Role.PRIVATE_PRACTICE]: {
      icon: <UserIcon className="w-5 h-5" />,
      label: "PRIVATE PRACTICE",
    },
    [Role.INDIVIDUAL]: {
      icon: <UsersIcon className="w-5 h-5" />,
      label: "INDIVIDUAL",
    },
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (role: Role) => {
    onRoleChange(role);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full flex items-center justify-between text-left px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-clinic-primary focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex items-center">
          <span className="mr-3 text-clinic-accent">
            {roleData[selectedRole as keyof typeof roleData]?.icon}
          </span>
          {roleData[selectedRole as keyof typeof roleData]?.label}
        </span>
        <ChevronDownIcon
          className={`w-5 h-5 ml-2 text-gray-400 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <ul className="py-1" role="listbox">
            {Object.keys(roleData).map((role) => (
              <li key={role} role="option">
                <button
                  type="button"
                  onClick={() => handleSelect(role as Role)}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center focus:outline-none focus:bg-gray-50"
                >
                  <span className="mr-3 text-gray-500">
                    {roleData[role as keyof typeof roleData].icon}
                  </span>
                  {roleData[role as keyof typeof roleData].label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignUp }) => {
  const [login, { isLoading }] = useLoginMutation();
  const { state } = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: state?.email || "",
      password: state?.password || "",
      role:
        state?.userType === "CLINIC" ? Role.PRIVATE_PRACTICE : Role.INDIVIDUAL,
    },
  });
  console.log(state)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentRole = watch("role");

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const response = await login({
        email: data?.email,
        password: data?.password,
        userType: state?.userType,
      }).unwrap();
      console.log(response);
      localStorage.setItem("token", response.accessToken);
      dispatch(
        setCredentials({
          user: response.user,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          userType: response.userType,
        })
      );
      if (response?.userType === "THERAPIST") {
        dispatch(
          setCredentials({
            user: response.user,
            userType:response.userType,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          })
        );
        navigate("/individual-therapist-dashboard");
      } else if (response.userType === "CLINIC") {
        navigate("/private-practice-admin");
        // }else {
        //   dispatch(authSliceLogin({ role: "user" }));
        // navigate("/private-practice-admin");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      <div className="flex justify-between items-center mb-8 mt-4 mx-2">
        <div className="w-auto">
          <RoleSelector
            selectedRole={currentRole}
            onRoleChange={(role) =>
              setValue("role", role, { shouldValidate: true })
            }
            disabled={isLoading}
          />
          {errors.role && (
            <p
              id="login-role-error"
              className="text-red-500 text-xs mt-2 flex items-center"
            >
              <span className="mr-1">⚠</span>
              {errors.role.message}
            </p>
          )}
        </div>
        <p className="text-sm">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="font-bold text-clinic-accent hover:underline focus:outline-none focus:ring-2 focus:ring-clinic-accent focus:ring-offset-2 rounded text-[#3FDCBF]"
            disabled={isLoading}
          >
            Register
          </button>
        </p>
      </div>

      <div className="flex flex-col justify-center mx-4">
        <div className="w-full">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 mt-[150px]"
          >
            <div>
              <label
                htmlFor="login-email"
                className="text-sm font-bold text-gray-700 block mb-2"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                {...register("email")}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-primary focus:border-transparent transition-colors bg-[#fff]"
                aria-describedby={
                  errors.email ? "login-email-error" : undefined
                }
                disabled={isLoading}
              />
              {errors.email && (
                <p
                  id="login-email-error"
                  className="text-red-500 text-xs mt-2 flex items-center"
                >
                  <span className="mr-1">⚠</span>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="text-sm font-bold text-gray-700 block mb-2"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                {...register("password")}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-primary focus:border-transparent transition-colors bg-[#fff]"
                aria-describedby={
                  errors.password ? "login-password-error" : undefined
                }
                disabled={isLoading}
              />
              {errors.password && (
                <p
                  id="login-password-error"
                  className="text-red-500 text-xs mt-2 flex items-center"
                >
                  <span className="mr-1">⚠</span>
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#298CDF] text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-clinic-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Log In...
                </span>
              ) : (
                "Log In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
