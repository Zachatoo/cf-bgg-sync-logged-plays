export type Cookies = {
	bggusername: string;
	bggpassword: string;
	SessionID: string;
};

export function objectToCookieString(cookies: Cookies) {
	const cookieStrings = Object.entries(cookies).map(([key, value]) => `${key}=${value};`);
	return cookieStrings.join(' ');
}
