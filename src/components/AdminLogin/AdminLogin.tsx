import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/Slices/AuthSlice/authSlice";
import { useLoginMutation } from "@/store/api/AuthApi";

// Admin login schema
const adminLoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AdminLoginInputs = z.infer<typeof adminLoginSchema>;

const AdminLoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginInputs>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit: SubmitHandler<AdminLoginInputs> = async (data) => {
    try {
      const response = await login({
        email: data.email,
        password: data.password,
        userType: "ADMIN", // ⚡ Important: tell backend this is admin login
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

      navigate("/admin-dashboard"); // redirect to admin
    } catch (error) {
      console.error("Admin Login Error:", error);
      alert("Invalid admin credentials. Please try again.");
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[500px] justify-center mx-6">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Admin Login</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email */}
        <div>
          <label className="block mb-2 font-bold text-gray-700 text-sm">
            Email
          </label>
          <input
            type="email"
            {...register("email")}
            placeholder="Enter admin email"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-[#298CDF] focus:border-transparent"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">
              ⚠ {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block mb-2 font-bold text-gray-700 text-sm">
            Password
          </label>
          <input
            type="password"
            {...register("password")}
            placeholder="Enter password"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-[#298CDF] focus:border-transparent"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              ⚠ {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-[#298CDF] text-white font-bold rounded-lg 
                     hover:bg-opacity-90 transition disabled:opacity-50"
        >
          {isLoading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
};

export default AdminLoginForm;
