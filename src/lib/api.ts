import { HTTPMethod } from "workbox-routing/utils/constants";
import { domain } from "..";
import { AccessTokenState } from "./auth";
import { getRecoilExternalLoadable, setRecoilExternalState } from "./recoilUtil";

/**
 * Make an authenticated request against the REST API.
 * @param method Request method
 * @param path The path to make the request to
 * @param body Optional body to include in the request
 * @returns Fetch response
 */
export async function makeAuthenticatedRequest(method: HTTPMethod, path: string, body?: any) {
    const jwt = getRecoilExternalLoadable(AccessTokenState).getValue();
    const res = await makeRequest({ jwt, method, path, body });

    if (res.status === 403) {
        // Session expired, try refresh
        const { success, token } = await refreshToken();
        if (!success || !token) {
            setRecoilExternalState(AccessTokenState, null);
            throw new Error("Failed to authenticate, please log in again.");
        }

        setRecoilExternalState(AccessTokenState, token);
        return await makeRequest({ jwt: token, method, path, body });
    }

    return res;
}

async function makeRequest({
    method,
    path,
    jwt,
    body,
}: {
    method: HTTPMethod;
    path: string;
    jwt?: string | null;
    body?: any;
}) {
    return fetch(`${domain}/api/v1${path}`, {
        method,
        body: JSON.stringify(body),
        credentials: "include",
        headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
        },
    });
}

async function refreshToken(): Promise<{ success: boolean; token?: string }> {
    try {
        const res = await fetch(`${domain}/api/v1/auth/reauth`, {
            method: "POST",
            credentials: "include",
        });

        if (res.status !== 200) return { success: false };

        return { success: true, token: (await res.json()).token };
    } catch {
        return { success: false };
    }
}
