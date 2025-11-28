import AuthLayout from "@/components/Authentications/AuthLayout";
import AdminLoginForm from "@/components/AdminLogin/AdminLogin";

const AdminLoginPage = () => {
  return (
    <AuthLayout role={"ADMIN" as any}>
      <AdminLoginForm />
    </AuthLayout>
  );
};

export default AdminLoginPage;
