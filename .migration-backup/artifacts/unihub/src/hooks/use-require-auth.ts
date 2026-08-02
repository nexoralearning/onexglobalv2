import { useState, useEffect } from "react"
import { useLocation } from "wouter"
import { getCurrentUser } from "@/lib/auth"

export function useRequireAuth() {
  const [location, setLocation] = useLocation()
  const [user, setUser] = useState(getCurrentUser())

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      setLocation("/login")
    } else {
      setUser(currentUser)
    }
  }, [location, setLocation])

  return user
}
