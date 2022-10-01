import SessionLayout from "@/components/layouts/Session";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useEffect, useState } from "react";

export default function Profile() {
  const { currentUser, fetcherWithToken } = useCurrentUser();
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    if (currentUser) {
      fetcherWithToken(
        "https://sakko-demo-api.herokuapp.com/api/v1/user/blogs"
      ).then((json) => {
        console.log("blog", json);
        setBlogs(json);
      });
    }
  }, [currentUser]);
  return <SessionLayout>{JSON.stringify(blogs)}</SessionLayout>;
}
