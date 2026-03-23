"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export default function AuthPage() {
  const router = useRouter();
  const { signIn, signUp, user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Already logged in
  if (user) {
    router.push("/profile");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("请填写邮箱和密码");
      return;
    }
    if (password.length < 6) {
      setError("密码至少 6 位");
      return;
    }

    setLoading(true);
    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error === "Invalid login credentials" ? "邮箱或密码错误" : error);
      } else {
        router.push("/profile");
      }
    } else {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error);
      } else {
        setSuccess("注册成功！请查看邮箱确认链接，确认后即可登录。");
      }
    }
    setLoading(false);
  };

  return (
    <div className="max-w-sm mx-auto mt-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">
          {isLogin ? "登录" : "注册"} LemonTalk CasePrep
        </h1>
        <p className="text-muted text-sm mt-2">
          {isLogin ? "登录后可保存个人档案、刷题记录" : "注册后开始你的 Case 面试准备之旅"}
        </p>
      </div>

      <div className="border border-border rounded-xl p-6 bg-white">
        {error && (
          <div className="bg-red-50 border border-danger text-danger rounded-lg px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isLogin ? "输入密码" : "至少 6 位"}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white rounded-lg py-3 text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "请稍候..." : isLogin ? "登录" : "注册"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => { setIsLogin(!isLogin); setError(""); setSuccess(""); }}
            className="text-sm text-primary hover:underline"
          >
            {isLogin ? "没有账号？注册" : "已有账号？登录"}
          </button>
        </div>
      </div>

      <div className="text-center mt-6">
        <Link href="/" className="text-sm text-muted hover:text-primary">
          ← 返回首页
        </Link>
      </div>
    </div>
  );
}
