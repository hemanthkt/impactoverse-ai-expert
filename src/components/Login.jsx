"use client";

import { getCookie } from "@/utils/getCookies";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function Login() {
  const uuid = getCookie("userId");
  const email = getCookie("email");
  const username = getCookie("username");
  const user = { uuid, email, username };
  const router = useRouter();

  useEffect(() => {
    fetch("/api/loginCheck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Server response:", data);
        if (data.user) {
          router.push("/avatar");
        }
      })

      .catch((err) => {
        console.error("Fetch error:", err);
      });
  }, []);

  return (
    <div>
      <h2>Checking for credentials...</h2>
    </div>
  );
}

export default Login;
