import axios from "axios";

export const fetchRefreshToken = async (refreshToken: string) => {
  const response = await axios.post(
    "http://localhost:9090/refresh_token",
    {},
    {
      headers: { Authorization: refreshToken },
    }
  );

  return {
    token: response.data.token,
    expiration: response.data.expiration,
  };
};
