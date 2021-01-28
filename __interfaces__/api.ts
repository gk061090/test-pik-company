import { IToken } from "./token";
import { IUser } from "./user";

export type LoginType = IToken & { user: IUser };
