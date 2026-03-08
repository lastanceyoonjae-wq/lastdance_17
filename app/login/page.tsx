"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function LoginPage() {
  // const supabase = createClient()

  const [supabase, setSupabase] = useState<any>(null)

  useEffect(() => {
    setSupabase(createClient())
  }, [])

  if (!supabase) return null

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    await supabase.auth.signInWithPassword({
      email,
      password,
    })

    window.location.href = "/dashboard"
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="p-6 w-[350px] space-y-4">
        <h1 className="text-xl font-bold">Login</h1>

        <Input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button onClick={handleLogin} className="w-full">
          Login
        </Button>
      </Card>
    </div>
  )
}