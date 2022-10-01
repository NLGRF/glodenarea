import DefaultLayout from "@/components/layouts/Default";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "@/store/session";
import { useRouter } from "next/router";
export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [username, setUserName] = useState("admin");
  const [password, setPassword] = useState("1234");

  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      router.push("/auth/profile");
    }
  }, []);
  
  const handleLogin = async () => {
    const url = "http://localhost:8080/login";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    const json = await response.json();
    // console.log("JSON", json);
    dispatch(setToken(json.token));
    router.replace("/auth/profile");
  };
  return (
    <DefaultLayout>
      <div>
        <div>UserName</div>
        <input
          type="text"
          value={username}
          onChange={(e) => {
            setUserName(e.target.value);
          }}
        />
      </div>
      <div>
        <div>Password</div>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </div>
      <div>
        <button onClick={handleLogin}>Login</button>
      </div>
    </DefaultLayout>
  );
}
