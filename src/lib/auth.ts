import jwt from "jsonwebtoken";
import { atom, selector } from "recoil";

export const AccessTokenState = atom<string | null>({
    key: "AccessToken",
    default: null,
});

export const IsLoggedIn = selector({
    key: "IsLoggedIn",
    get: ({ get }) => {
        return !!get(AccessTokenState);
    },
});

export const UID = selector({
    key: "UID",
    get: ({ get }) => {
        const token = get(AccessTokenState);
        if (!token) return "";

        const data = jwt.decode(token) as { uid: string };
        return data.uid;
    },
});
