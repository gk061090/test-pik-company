import axios from "axios";
import { IUser } from "../__interfaces__/user";
import { IToken } from "../__interfaces__/token";
import { LoginType } from "../__interfaces__/api";

export const fetchLogin = async ({ email, password }: IUser) => {
  try {
    const response = await axios.post<LoginType>(
      "http://localhost:9090/login",
      {
        email,
        password,
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
