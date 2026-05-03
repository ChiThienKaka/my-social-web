import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import http from "@/lib/http";

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const decodeJwtPayload = (token: string) => {
    try {
      const parts = token.split(".");
      if (parts.length < 2) return null;
      const payloadB64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const json = atob(payloadB64);
      return JSON.parse(json);
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    if (!formData.password.trim()) {
      setError("Password is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    console.log("Attempting login with:", formData.email);

    try {
      // Call real backend API
      const response: any = await http.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      console.log("Login response:", response);

      if (response && response.access_token) {
        const { user, access_token } = response;
        console.log("User:", user);
        const isDemoAdmin =
          formData.email.trim().toLowerCase() === "admin@gmail.com" &&
          formData.password === "123456";

        const tokenPayload = decodeJwtPayload(access_token);
        console.log("Login demo admin check:", isDemoAdmin);

        // Map backend role to frontend role string
        // We check role_id, role object, or role name string with various common formats
        const roleId =
          user.role_id ||
          (typeof user.role === "object"
            ? user.role?.role_id || user.role?.id
            : user.role);

        const roleName =
          typeof user.role === "object"
            ? user.role?.role_name || user.role?.name || user.role?.display_name
            : typeof user.role === "string"
              ? user.role
              : "";

        console.log("Detected role identifier:", roleId, "name:", roleName);

        let role: "admin" | "employer" | "student" = "student";

        // Match by ID (1=admin, 4=employer, 2=student) or by Name.
        // Some backends may return role_id as string or role_name with different formats,
        // so we normalize defensively.
        const roleIdNum =
          typeof roleId === "string" ? Number(roleId) : roleId;
        const roleNameLower = String(roleName || "").toLowerCase();

        // Priority 1: hardcoded demo admin credentials
        if (isDemoAdmin) {
          role = "admin";
        } else {
          // Priority 2: decode role from JWT payload if present
          const tokenRoleId =
            tokenPayload?.role_id ?? tokenPayload?.roleId ?? tokenPayload?.role_id_num;
          const tokenRoleName = String(
            tokenPayload?.role_name ?? tokenPayload?.roleName ?? "",
          ).toLowerCase();

          const tokenRoleIdNum =
            typeof tokenRoleId === "string" ? Number(tokenRoleId) : tokenRoleId;

          console.log("Decoded token role:", { tokenRoleIdNum, tokenRoleName });

          if (tokenRoleIdNum === 1 || tokenRoleName.includes("admin")) {
            role = "admin";
          } else if (
            tokenRoleIdNum === 4 ||
            tokenRoleName.includes("employer") ||
            tokenRoleName.includes("recruiter")
          ) {
            role = "employer";
          } else if (tokenRoleIdNum === 2 || tokenRoleName.includes("student")) {
            role = "student";
          } else {
            // Priority 3: mapping from response `user`
            if (roleIdNum === 1 || roleNameLower.includes("admin")) role = "admin";
            else if (
              roleIdNum === 4 ||
              roleNameLower.includes("employer") ||
              roleNameLower.includes("recruiter")
            )
              role = "employer";
            else if (roleIdNum === 2 || roleNameLower.includes("student"))
              role = "student";
          }
        }

        console.log("Mapped role result:", role);

        const userData = {
          id: (user.user_id || user.id || "").toString(),
          name: user.name || user.full_name || "Admin User",
          email: user.email,
          role,
          avatar_url:
            (user.avatar_url as string | null | undefined) ??
            user.profile?.avatar_url ??
            null,
        };
        console.log("Setting user in store:", userData);

        // Use auth store
        login(userData, access_token);

        // Redirect based on role.
        // Admin overview in `admin.routes.tsx` is at `/admin` (index route).
        if (role === "admin") {
          console.log("Redirecting to /admin (overview)");
          navigate("/admin", { replace: true });
        } else if (role === "employer") {
          console.log("Redirecting to /employer");
          navigate("/employer", { replace: true });
        } else {
          console.log("Redirecting to / (default)");
          navigate("/", { replace: true });
        }
      } else {
        setError("Invalid response from server");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Invalid email or password. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* School Branding */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
            <span className="text-2xl font-bold text-white">U</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">University Admin</h1>
          <p className="mt-2 text-gray-600">Sign in to manage your platform</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@university.edu"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </Label>
                </div>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-medium text-blue-900">
                Demo Credentials:
              </p>
              <p className="mt-1 text-xs text-blue-700">
                Email: admin@university.edu
                <br />
                Password: admin123
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          © 2024 University Admin. All rights reserved.
        </p>
      </div>
    </div>
  );
}
