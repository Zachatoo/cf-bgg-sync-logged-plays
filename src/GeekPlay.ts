export type GeekPlay = {
	// id: string;
	/** @example 2024-09-08T06:00:00.000Z */
	date: string;
	quantity: number;
	/** Length of game, in minutes */
	length: number;
	incomplete: boolean;
	location: string;
	nowinstats: boolean;
	item: {
		name: string;
		objecttype: string;
		objectid: string;
		subtypes: string[];
	} | null;
	players: {
		name: string;
		username: string;
		userid: number;
		win: boolean;
		color: string;
		new: boolean;
		score: string;
		startposition: string;
		rating: string;
	}[];
};

export type GeekPlayBody = GeekPlay & {
	action: 'save' | 'delete';
	twitter: false;
	objecttype: 'thing';
	objectid: string;
	/** @example 2024-09-08 */
	playdate: string;
	ajax: 1;
};
