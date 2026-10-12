"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Layers3, LoaderCircle } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  fullName: z.string().trim().min(1, "Full name is required.").max(200, "Name must be 200 characters or fewer."),
  email: z.string().email("Enter a valid email address.").max(320),
  password: z.string().min(8, "Password must be at least 8 characters.").max(100, "Password must be 100 characters or fewer."),
  confirmPassword: z.string().min(1, "Please confirm your password."),
}).refine((values) => values.password === values.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});
type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: createAccount } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError("");
    try {
      await createAccount({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      });
      toast.success("Account created. Sign in to continue.");
      router.replace("/login");
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Unable to create your account.");
    }
  };

  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-[minmax(0,1fr)_minmax(460px,0.9fr)]">
      <aside className="relative hidden overflow-hidden bg-slate-950 px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden="true" className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px)] [background-size:44px_44px]" />
        <Link href="/login" className="relative flex items-center gap-3 font-semibold"><span className="grid size-10 place-items-center rounded-lg bg-blue-600"><Layers3 className="size-5" /></span>TaskTrack</Link>
        <div className="relative max-w-lg pb-12">
          <p className="text-sm font-semibold text-blue-300">A CLEARER WAY TO WORK</p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight">Bring teams and delivery into focus.</h1>
          <p className="mt-4 max-w-md text-base leading-7 text-slate-300">Set up your workspace account and keep projects moving with less friction.</p>
        </div>
        <p className="relative text-xs text-slate-400">TaskTrack · Operations workspace</p>
      </aside>
      <section className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <Link href="/login" className="mb-10 flex items-center gap-2 font-semibold text-slate-900 lg:hidden"><span className="grid size-9 place-items-center rounded-lg bg-blue-600 text-white"><Layers3 className="size-5" /></span>TaskTrack</Link>
          <p className="text-sm font-semibold text-blue-700">REGISTER</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-950">Create your account</h2>
          <p className="mt-2 text-sm text-slate-600">Create your workspace account.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
            <div>
              <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-slate-800">Full name</label>
              <Input id="fullName" autoComplete="name" placeholder="Your name" aria-invalid={Boolean(errors.fullName)} className="h-11 bg-white px-3" {...register("fullName")} />
              {errors.fullName && <p className="mt-1.5 text-sm text-rose-700">{errors.fullName.message}</p>}
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-800">Email</label>
              <Input id="email" type="email" autoComplete="email" placeholder="name@company.com" aria-invalid={Boolean(errors.email)} className="h-11 bg-white px-3" {...register("email")} />
              {errors.email && <p className="mt-1.5 text-sm text-rose-700">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-800">Password</label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="At least 8 characters" aria-invalid={Boolean(errors.password)} className="h-11 bg-white px-3 pr-11" {...register("password")} />
                <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 grid w-11 place-items-center text-slate-500 hover:text-slate-900">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
              </div>
              {errors.password && <p className="mt-1.5 text-sm text-rose-700">{errors.password.message}</p>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-slate-800">Confirm password</label>
              <div className="relative">
                <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" placeholder="Re-enter your password" aria-invalid={Boolean(errors.confirmPassword)} className="h-11 bg-white px-3 pr-11" {...register("confirmPassword")} />
                <button type="button" onClick={() => setShowConfirmPassword((value) => !value)} aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"} className="absolute inset-y-0 right-0 grid w-11 place-items-center text-slate-500 hover:text-slate-900">{showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
              </div>
              {errors.confirmPassword && <p className="mt-1.5 text-sm text-rose-700">{errors.confirmPassword.message}</p>}
            </div>
            {serverError && <p role="alert" className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-800">{serverError}</p>}
            <Button type="submit" disabled={isSubmitting} className="h-11 w-full bg-blue-600 text-white hover:bg-blue-700">{isSubmitting && <LoaderCircle className="size-4 animate-spin" />}{isSubmitting ? "Registering..." : "Register"}</Button>
          </form>
          <p className="mt-7 text-center text-sm text-slate-600">Already registered? <Link href="/login" className="font-semibold text-blue-700 hover:text-blue-800">Sign in</Link></p>
        </div>
      </section>
    </main>
  );
}
