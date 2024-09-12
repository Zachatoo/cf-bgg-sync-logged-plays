import { GeekPlay } from './GeekPlay';

export function compareGeekPlays(geekPlay1: GeekPlay, geekPlay2: GeekPlay) {
	return entriesFromObject(geekPlay1).every(([key, value]) => {
		const geekPlay2Value = geekPlay2[key];
		if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
			return value === geekPlay2Value;
		}
		const item2Value = geekPlay2.item;
		if (key === 'item' && value !== null && item2Value !== null) {
			return value.objectid === item2Value.objectid;
		}
		if (key === 'players') {
			const players2Value = geekPlay2.players;
			return value.every((player1) => players2Value.some((player2) => player1.name === player2.name || player1.userid === player2.userid));
		}
		return false;
	});
}

function entriesFromObject<T extends object>(object: T): Entries<T> {
	return Object.entries(object) as Entries<T>;
}

type Entries<T> = {
	[K in keyof T]: [K, T[K]];
}[keyof T][];
