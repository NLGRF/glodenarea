import SessionLayout from "@/components/layouts/Session";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useEffect, useState } from "react";

export default function Profile() {
  const { currentUser, fetcherWithToken } = useCurrentUser();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (currentUser) {
      fetcherWithToken(
        "http://localhost:8080/users"
      ).then((json) => {
        // console.log("users", json);
        setUsers(json);
      });
    }
  }, [currentUser]);
  // return <SessionLayout>{JSON.stringify(users)}</SessionLayout>;
  return (
    <SessionLayout>
      <div>
        <div>All User Profile</div>
        {/* <p>{JSON.stringify(users)}</p> */}
        <ul>
          {users.map((user) => (
            <li key={user.ID}>{user.username}</li>
          ))}
        </ul>
      </div>
    </SessionLayout>
  );
}
