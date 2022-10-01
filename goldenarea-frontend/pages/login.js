import DefaultLayout from "@/components/layouts/Default";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "@/store/session";
import { useRouter } from "next/router";
export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState("saklism+demo1@gmail.com");
  const [password, setPassword] = useState("12341234");
  const handleLogin = async () => {
    const url = "https://sakko-demo-api.herokuapp.com/api/v1/user/sign_in";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        user: {
          email,
          password,
        },
      }),
    });
    const json = await response.json();
    console.log("JSON", json);
    dispatch(setToken(json.user.auth_jwt));
    router.replace("/auth/profile");
  };
  return (
    <DefaultLayout>
      <div>
        <div>Email</div>
        <input
          type="text"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
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
