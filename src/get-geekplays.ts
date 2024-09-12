import { GeekPlay } from './GeekPlay';

export async function getGeekPlays(username: string, env: Env) {
	const res = await fetch(`${env.BGG_BASE_URL}/xmlapi2/plays?username=${username}`);
	const plays: GeekPlay[] = [];
	await new HTMLRewriter()
		.on('play', {
			element(element) {
				const play: GeekPlay = {
					date: getEscapedAttribute(element, 'date') ?? '',
					quantity: parseInt(getEscapedAttribute(element, 'quantity') ?? '0', 10),
					length: parseInt(getEscapedAttribute(element, 'length') ?? '0', 10),
					incomplete: getEscapedAttribute(element, 'incomplete') === '1',
					nowinstats: getEscapedAttribute(element, 'nowinstats') === '1',
					location: getEscapedAttribute(element, 'location') ?? '',
					item: null,
					players: [],
				};
				plays.push(play);
			},
		})
		.on('play item', {
			element(element) {
				const item = {
					name: getEscapedAttribute(element, 'name') ?? '',
					objecttype: getEscapedAttribute(element, 'objecttype') ?? '',
					objectid: getEscapedAttribute(element, 'objectid') ?? '',
					subtypes: [],
				};
				const lastPlay = plays[plays.length - 1];
				lastPlay.item = item;
			},
		})
		.on('play item subtypes subtype', {
			element(element) {
				const subtype = getEscapedAttribute(element, 'value');
				if (!subtype) return;
				const lastPlay = plays[plays.length - 1];
				lastPlay.item?.subtypes.push(subtype);
			},
		})
		.on('play players player', {
			element(element) {
				const player = {
					name: getEscapedAttribute(element, 'name') ?? '',
					username: getEscapedAttribute(element, 'username') ?? '',
					userid: parseInt(getEscapedAttribute(element, 'userid') ?? '', 10),
					win: getEscapedAttribute(element, 'win') === '1',
					color: getEscapedAttribute(element, 'color') ?? '',
					new: getEscapedAttribute(element, 'new') === '1',
					score: getEscapedAttribute(element, 'score') ?? '',
					startposition: getEscapedAttribute(element, 'startposition') ?? '',
					rating: getEscapedAttribute(element, 'rating') ?? '0',
				};
				const lastPlay = plays[plays.length - 1];
				lastPlay.players.push(player);
			},
		})
		.transform(res)
		.arrayBuffer();
	return plays;
}

function getEscapedAttribute(element: Element, name: string) {
	const attribute = element.getAttribute(name) ?? '';
	return attribute
		.replace(/&amp;/g, '&')
		.replace(/"&gt;"/g, '>')
		.replace(/&lt;/g, '<')
		.replace(/&apos;/g, "'")
		.replace(/&quot;/g, '"')
		.replace(/(&#(\d+);)/g, (match, capture, charCode) => String.fromCharCode(charCode));
}
