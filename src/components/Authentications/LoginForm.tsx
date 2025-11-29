/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/Slices/AuthSlice/authSlice";
import { Role } from "./types";
import { UserIcon, UsersIcon, ChevronDownIcon } from "./Icons";
import { useLoginMutation } from "@/store/api/AuthApi";
import { toast } from "sonner";

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
      label: "CLINIC",
    },
    [Role.INDIVIDUAL]: {
      icon: <UsersIcon className="w-5 h-5" />,
      label: "INDIVIDUAL THERAPIST",
    },
    [Role.THERAPIST]: {
      icon: <UsersIcon className="w-5 h-5" />,
      label: "THERAPIST",
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
      role: state?.userType || Role.PRIVATE_PRACTICE,
    },
  });

  const currentRole = watch("role");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const response = await login({
        email: data.email,
        password: data.password,

        // Ensure API receives correct role
        userType: state?.userType ?? data.role,
      }).unwrap();

      localStorage.setItem("token", response.accessToken);
      dispatch(
        setCredentials({
          user: response.user,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          userType: response.userType,
        })
      );

      if (response.userType === "INDIVIDUAL_THERAPIST") {
        navigate("/individual-therapist-dashboard");
      } else if (response.userType === "CLINIC") {
        navigate("/private-practice-admin");
      } else if (response.userType === "THERAPIST") {
        navigate("/therapist");
      }

      toast.success("Login successful!");
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "data" in err) {
        toast.error((err as any).data?.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
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
            disabled={isLoading} // FIX: no longer disabled by state.userType
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
            className="font-bold text-clinic-accent hover:underline"
            disabled={isLoading}
          >
            Register
          </button>
        </p>
      </div>

      <div className="flex flex-col justify-center mx-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 mt-[150px] md:w-2/4 mx-auto"
        >
          <div>
            <label className="text-sm font-bold text-gray-700 block mb-2">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-2 flex items-center">
                <span className="mr-1">⚠</span> {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 block mb-2">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-2 flex items-center">
                <span className="mr-1">⚠</span> {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#298CDF] text-white font-bold py-3 px-4 rounded-lg"
          >
            {isLoading ? "Log In..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
