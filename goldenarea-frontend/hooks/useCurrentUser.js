import { useSelector, useDispatch } from "react-redux";
import useSWR from "swr";
import { setUser, resetAll } from "@/store/session";
import { useEffect } from "react";
export default function useCurrentUser() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.session.token);
  const currentUser = useSelector((state) => state.session.user);

  const fetcher = async (...args) => {
    if (args.length <= 1) {
      args.push({});
    }
    const options = args[1];
    if (!options.headers) {
      options.headers = {};
    }
    options.headers["content-type"] = "application/json";
    const response = await fetch(...args);
    const json = response.json();
    return json;
  };

  const fetcherWithToken = async (...args) => {
    if (args.length <= 1) {
      args.push({});
    }
    const options = args[1];
    if (!options.headers) {
      options.headers = {};
    }
    options.headers["auth-token"] = `Bearer ${token}`;
    return await fetcher(...args);
  };

  const logout = async () => {
    const url = "https://sakko-demo-api.herokuapp.com/api/v1/user/sign_out";
    const response = await fetcherWithToken(url, { method: "DELETE" });
    dispatch(resetAll());
    window.location = "/login";
  };

  const { data: userData } = useSWR(
    token.length > 0
      ? "https://sakko-demo-api.herokuapp.com/api/v1/user/me"
      : null,
    fetcherWithToken
  );
  useEffect(() => {
    if (userData) {
      dispatch(setUser(userData.user));
    }
  }, [userData]);

  return { token, currentUser, fetcher, fetcherWithToken, logout };
}
