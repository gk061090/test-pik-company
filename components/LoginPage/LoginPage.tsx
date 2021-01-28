import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, RootState } from "../../store";
import { useRouter } from "next/router";

export const LoginPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector((store: RootState) => store.user);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.target as HTMLFormElement);

    dispatch(
      login({
        email: `${form.get("email")}`,
        password: `${form.get("password")}`,
      })
    );
  };

  useEffect(() => {
    // супер упрощенная проверка
    if (user.username) {
      router.push("/user");
    }
  }, [user]);

  return (
    <div>
      <p>Login page</p>
      <form onSubmit={submit}>
        <div>
          <input type="email" name="email" placeholder="Email" />
        </div>
        <div>
          <input type="password" name="password" placeholder="Password" />
        </div>
        <div>
          <button type="submit">Войти</button>
        </div>
      </form>
    </div>
  );
};
