"use client"
import * as React from "react"
import { useRouter } from 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from "@/lib/firebase/auth"
import { Chrome } from "lucide-react"
import { useAuth as useFirebaseAuth } from "@/hooks/use-auth"
import { type Auth } from "firebase/auth"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
})
type FormData = z.infer<typeof formSchema>

export function LoginForm({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false)
  const { toast } = useToast()
  const router = useRouter()
  const auth = useFirebaseAuth() as Auth;

  async function onSubmit(data: FormData) {
    setIsLoading(true)
    try {
      await signInWithEmail(data.email, data.password, auth)
      router.push('/')
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
         try {
            await signUpWithEmail(data.email, data.password, auth);
            toast({
                title: "Account Created",
                description: "Welcome! Your new account has been created.",
            });
            router.push('/');
         } catch(signUpError: any) {
            toast({
                variant: "destructive",
                title: "Sign up failed.",
                description: signUpError.message,
            })
         }
      } else {
        toast({
          variant: "destructive",
          title: "Authentication failed.",
          description: error.message,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function onGoogleSignIn() {
    setIsGoogleLoading(true)
    try {
      await signInWithGoogle(auth)
      router.push('/')
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google Sign-In failed.",
        description: error.message,
      })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading || isGoogleLoading}
              {...register("email")}
            />
            {errors.email && <p className="px-1 text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="password"
              type="password"
              disabled={isLoading || isGoogleLoading}
              {...register("password")}
            />
            {errors.password && <p className="px-1 text-xs text-destructive">{errors.password.message}</p>}
          </div>
          <Button disabled={isLoading || isGoogleLoading}>
            {isLoading && (
              <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            )}
            Sign In / Sign Up
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading || isGoogleLoading} onClick={onGoogleSignIn}>
        {isGoogleLoading ? (
          <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        ) : (
          <Chrome className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
    </div>
  )
}
