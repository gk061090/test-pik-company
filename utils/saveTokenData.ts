import { IToken } from "../__interfaces__/token";

export const saveTokenData = (data: IToken) => {
  localStorage.setItem("tokenData", JSON.stringify(data));
};
