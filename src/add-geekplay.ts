import { Cookies, objectToCookieString } from './cookies';
import { GeekPlay, GeekPlayBody } from './GeekPlay';

export async function addGeekPlay(geekPlay: GeekPlay, cookies: Cookies, env: Env) {
	const play: GeekPlayBody = {
		action: 'save',
		twitter: false,
		objecttype: 'thing',
		objectid: geekPlay.item?.objectid ?? '',
		playdate: geekPlay.date,
		ajax: 1,
		...geekPlay,
	};
	const res = await fetch(`${env.BGG_BASE_URL}/geekplay.php`, {
		method: 'POST',
		body: JSON.stringify(play),
		headers: {
			'Content-Type': 'application/json',
			Cookie: objectToCookieString(cookies),
		},
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(text);
	}
}
