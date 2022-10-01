import SessionTopbar from "./reusable/SessionTopbar";
import styles from "./Session.module.css";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "@/store/session";
export default function Session({ children }) {
  const dispatch = useDispatch();
  const { token, currentUser } = useCurrentUser();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    dispatch(setToken(jwt));
  }, []);

  useEffect(() => {
    if (token && token.length > 0) {
      console.log("SESSION LAYOUT TOKEN", token);
    }
  }, [token]);

  useEffect(() => {
    if (currentUser) {
      console.log("SESSION LAYOUT currentUser", currentUser);
    }
  }, [currentUser]);

  return (
    <div>
      <SessionTopbar></SessionTopbar>
      <div className={styles.container}>{children}</div>
    </div>
  );
}
