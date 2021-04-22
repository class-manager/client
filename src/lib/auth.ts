import jwt from "jsonwebtoken";
import { atom, selector } from "recoil";

export enum loginState {
    Checking,
    LoggedIn,
    NotLoggedIn,
}

export const AccessTokenState = atom<string | null>({
    key: "AccessToken",
    default: "fetching",
});

export const IsLoggedIn = selector({
    key: "IsLoggedIn",
    get: ({ get }) => {
        const state = get(AccessTokenState);
        if (!state) return loginState.NotLoggedIn;
        if (state === "fetching") return loginState.Checking;
        else return loginState.LoggedIn;
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

export async function logout() {
    try {
        await fetch("https://classman.xyz/api/v1/auth/logout", {
            method: "POST",
            credentials: "include",
        });
    } catch (error) {}
}
