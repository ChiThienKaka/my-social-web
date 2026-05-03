import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye, EyeOff, User, AlertCircle } from "lucide-react";
import http from "@/lib/http";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ApiUser {
  user_id: number;
  full_name: string;
  email: string;
  avatar_url?: string | null;
}

interface AuthLoginResponse {
  access_token: string;
  expires_in: number;
  user: ApiUser;
}

export function AuthPage() {
  const navigate = useNavigate();
  const loginStore = useAuthStore((s) => s.login);
  const { isAuthenticated, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmittingRegister, setIsSubmittingRegister] = useState(false);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Nếu đã đăng nhập với role employer → redirect thẳng vào dashboard
  if (isAuthenticated && user?.role === "employer") {
    navigate("/employer", { replace: true });
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!loginData.email || !loginData.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setIsSubmittingLogin(true);
      const res = await http.post<AuthLoginResponse>("/auth/login", {
        email: loginData.email,
        password: loginData.password,
      });
      const { access_token, user } = res as unknown as AuthLoginResponse;
      console.log("User:", user);

      localStorage.setItem("access_token", access_token);
      loginStore(
        {
          id: String(user.user_id),
          email: user.email,
          role: "employer",
          name: user.full_name,
        },
        access_token,
      );
      navigate("/employer");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please check your credentials.";
      setError(message);
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !registerData.name?.trim() ||
      !registerData.email ||
      !registerData.password ||
      !registerData.confirmPassword
    ) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (registerData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      setIsSubmittingRegister(true);
      await http.post("/auth/register-recruiter", {
        name: registerData.name.trim(),
        email: registerData.email,
        password: registerData.password,
        password_confirmation: registerData.confirmPassword,
      });
      navigate("/employer/overview", { replace: true });
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Đăng ký thất bại. Vui lòng thử lại.";
      setError(message);
    } finally {
      setIsSubmittingRegister(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <nav className="border-b border-blue-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              TalentHub
            </button>
            <Button
              variant="outline"
              onClick={() => navigate("/subscription/pricing")}
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Back to Pricing
            </Button>
          </div>
        </div>
      </nav>

      {/* Auth Section */}
      <section className="py-20">
        <div className="mx-auto max-w-md px-6">
          <div className="mb-8 text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
              Employer Registration asdasdasd
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900">
              {activeTab === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="mt-2 text-gray-600">
              {activeTab === "login"
                ? "Sign in to continue with your subscription"
                : "Register to start hiring university talent dfgdfg"}
            </p>
          </div>

          <Card className="border-2 border-blue-100 shadow-xl">
            <CardHeader className="border-b border-gray-200 p-0">
              <div className="grid grid-cols-2">
                <button
                  onClick={() => {
                    setActiveTab("login");
                    setError("");
                  }}
                  className={`py-4 font-semibold transition-all ${
                    activeTab === "login"
                      ? "border-b-4 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setActiveTab("register");
                    setError("");
                  }}
                  className={`py-4 font-semibold transition-all ${
                    activeTab === "register"
                      ? "border-b-4 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Register
                </button>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="shrink-0" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {activeTab === "login" ? (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your.email@company.com"
                        className="h-12 pl-10"
                        value={loginData.email}
                        onChange={(e) =>
                          setLoginData({ ...loginData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="h-12 pl-10 pr-10"
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({
                            ...loginData,
                            password: e.target.value,
                          })
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                      />
                      <span className="text-gray-600">Remember me</span>
                    </label>
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmittingLogin}
                    className="h-12 w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 font-semibold shadow-lg shadow-blue-600/30 disabled:opacity-60"
                    size="lg"
                  >
                    {isSubmittingLogin ? "Signing in..." : "Sign In"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">
                      Họ và tên / Tên công ty{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Nhà tuyển dụng test"
                        className="h-12 pl-10"
                        value={registerData.name}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email công ty</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="hr@yourcompany.com"
                        className="h-12 pl-10"
                        value={registerData.email}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Use your official company email
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="h-12 pl-10 pr-10"
                        value={registerData.password}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            password: e.target.value,
                          })
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="register-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter your password"
                        className="h-12 pl-10 pr-10"
                        value={registerData.confirmPassword}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            confirmPassword: e.target.value,
                          })
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600">
                    By registering, you agree to our{" "}
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Privacy Policy
                    </button>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmittingRegister}
                    className="h-12 w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 font-semibold shadow-lg shadow-blue-600/30 disabled:opacity-60"
                    size="lg"
                  >
                    {isSubmittingRegister ? "Đang đăng ký..." : "Tạo tài khoản"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-sm text-gray-600">
            Need help?{" "}
            <button className="text-blue-600 hover:text-blue-700">
              Contact Support
            </button>
          </p>
        </div>
      </section>
    </div>
  );
}
