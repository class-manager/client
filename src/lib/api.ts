import { AccessTokenState } from "./auth";
import { getRecoilExternalLoadable } from "./recoilUtil";

/**
 * Make an authenticated request against the REST API.
 * @param method Request method
 * @param path The path to make the request to
 * @param body Optional body to include in the request
 * @returns Fetch response
 */
export async function makeAuthenticatedRequest(
    method: "GET" | "POST" | "PATCH" | "DELETE",
    path: string,
    body?: any
) {
    const jwt = getRecoilExternalLoadable(AccessTokenState).getValue();
    const res = await fetch(`https://classman.xyz/api/v1${path}`, {
        method,
        body: JSON.stringify(body),
        credentials: "include",
        headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
        },
    });

    return res;
}
