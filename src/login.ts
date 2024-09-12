import { Cookies } from './cookies';

export async function login(env: Env): Promise<Cookies> {
	const res = await fetch(`${env.BGG_BASE_URL}/login/api/v1`, {
		method: 'POST',
		body: JSON.stringify({
			credentials: {
				username: env.BGG_DESTINATION_USERNAME,
				password: env.BGG_DESTINATION_PASSWORD,
			},
		}),
		headers: {
			'Content-Type': 'application/json',
		},
	});
	const cookies = res.headers.getAll('Set-Cookie');
	const parsedCookieValues = cookies.map((cookie) => {
		const keyValueParts = cookie.split(';')[0];
		const [key, ...valueParts] = keyValueParts.split('=');
		return [key, valueParts.join('=')];
	});
	const newCookieValues = parsedCookieValues.filter(([key, value]) => value !== 'deleted');
	return Object.fromEntries(newCookieValues);
}
