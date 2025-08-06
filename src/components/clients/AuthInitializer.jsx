"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, setLoading } from "@/lib/store/authSlice";
import { useRouter } from "next/navigation";

export default function AuthInitializer() {
  const dispatch = useDispatch();

  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/auth/myprofile", { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        dispatch(setUser(data?.user || null))
        if(!data?.user){
          router.replace("/login");
        }
      })
      .finally(() => dispatch(setLoading(false)));

    return () => controller.abort();
  }, [dispatch]);

  return null;
}
