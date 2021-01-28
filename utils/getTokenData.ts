import { IToken } from "../__interfaces__/token";

export const getTokenData = (): IToken => {
  const json: string = localStorage.getItem("tokenData");

  if (!json) {
    return;
  }

  return JSON.parse(json);
};
