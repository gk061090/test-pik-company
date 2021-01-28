import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUser, RootState } from "../../store";

export const UserPage = () => {
  const dispatch = useDispatch();
  const username = useSelector((state: RootState) => state?.user?.username);
  const email = useSelector((state: RootState) => state?.user?.email);
  const id = useSelector((state: RootState) => state?.user?.id);
  const timezone = useSelector((state: RootState) => state?.user?.timezone);

  useEffect(() => {
    dispatch(getUser());
  }, []);

  if (!username || !email || !id || !timezone) {
    return <p>loading...</p>;
  }

  return (
    <div>
      <p>User: {username}</p>
      <p>Email: {email}</p>
      <p>ID: {id}</p>
      <p>Timezone: {timezone}</p>
    </div>
  );
};
