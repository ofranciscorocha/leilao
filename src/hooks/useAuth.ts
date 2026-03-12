import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState<{ id: string, email: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const signOut = async () => {
    setUser(null);
  };

  return { user, loading, signOut };
}
