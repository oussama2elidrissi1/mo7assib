"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";

const TENANTS = [
  { slug: "atlas", label: "Promoteur Atlas" },
  { slug: "horizon", label: "BTP Horizon" },
  { slug: "constructplus", label: "ConstructPlus Maroc" },
  { slug: "geniecivil", label: "Génie Civil Pro" },
  { slug: "nord", label: "Immobilière Nord" },
];

const schema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
  tenantSlug: z.string().min(1, "اختيار الحساب مطلوب"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setError("");
    try {
      await login(data.email, data.password, data.tenantSlug);
      router.push("/dashboard");
    } catch {
      setError("البريد الإلكتروني أو كلمة المرور أو الحساب غير صحيحة");
    }
  }

  return (
    <div className="min-h-screen bg-surface px-4 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden rounded-[2rem] bg-primary-900 p-10 text-white shadow-soft lg:block">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-accent-500">
            <Building2 size={28} />
          </div>
          <h1 className="mt-8 text-4xl font-extrabold">mo7assib</h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-primary-100">
            منصة مهيكرة لتدبير دورة حياة أوراش البناء: المشروع، الميزانية، النقطة، المصاريف، الرواتب، والوثائق داخل نفس فضاء العمل.
          </p>
          <div className="mt-12 rounded-3xl bg-white/10 p-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 text-accent-500" />
              <div>
                <p className="font-semibold">ولوج تجريبي — 5 حسابات مستقلة</p>
                <p className="mt-2 text-sm text-primary-100">اختر الحساب ثم سجل الدخول</p>
                <p className="text-sm text-primary-100">admin1@example.com … admin5@example.com</p>
                <p className="text-sm text-primary-100">password123</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft lg:p-10">
          <p className="text-xs font-semibold tracking-[0.24em] text-primary-600">تسجيل الدخول</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950">أهلا بك في mo7assib</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">دخل للحساب باش تراقب الورش، المصاريف، الرواتب ونسب الربحية من نفس المكان.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">الحساب</label>
              <select
                {...register("tenantSlug")}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
              >
                <option value="">اختر الحساب</option>
                {TENANTS.map((t) => (
                  <option key={t.slug} value={t.slug}>{t.label}</option>
                ))}
              </select>
              {errors.tenantSlug ? <p className="mt-1 text-xs text-red-500">{errors.tenantSlug.message}</p> : null}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">البريد الإلكتروني</label>
              <input
                type="email"
                autoComplete="email"
                {...register("email")}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                placeholder="admin1@example.com"
              />
              {errors.email ? <p className="mt-1 text-xs text-red-500">{errors.email.message}</p> : null}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">كلمة المرور</label>
              <input
                type="password"
                autoComplete="current-password"
                {...register("password")}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                placeholder="••••••••"
              />
              {errors.password ? <p className="mt-1 text-xs text-red-500">{errors.password.message}</p> : null}
            </div>

            {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}

            <button type="submit" disabled={isSubmitting} className="w-full rounded-2xl bg-primary-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:opacity-60">
              {isSubmitting ? "جاري تسجيل الدخول..." : "دخول إلى المنصة"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">نسخة تجريبية موجهة للمطورين العقاريين والمقاولات المتوسطة بالمغرب.</p>
        </div>
      </div>
    </div>
  );
}
