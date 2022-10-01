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
    options.headers["Authorization"] = `Bearer ${token}`;
    return await fetcher(...args);
  };

  const logout = async () => {
    dispatch(resetAll());
    window.location = "/login";
  };

  const { data: userData } = useSWR(
    token.length > 0
      ? "http://localhost:8080/user"
      : null,
    fetcherWithToken
  );
  useEffect(() => {
    if (userData) {
      // console.log("userData", userData);
      dispatch(setUser(userData.username));
    }
  }, [userData]);

  return { token, currentUser, fetcher, fetcherWithToken, logout };
}
