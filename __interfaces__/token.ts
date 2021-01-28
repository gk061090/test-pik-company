export interface IToken {
  token: string;
  refresh_token: string;
  expiration: string;
}

export type RefreshTokenType = Omit<IToken, "refresh_token">;
