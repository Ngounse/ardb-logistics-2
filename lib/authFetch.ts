export async function authFetch(
    input: RequestInfo,
    init: RequestInit = {}
) {
    const token = localStorage.getItem("token");
    console.log("token::", token);

    return fetch(input, {
        ...init,
        headers: {
            ...init.headers,
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
        },
    });
}
