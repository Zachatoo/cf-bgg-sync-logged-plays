import { getGeekPlays } from './get-geekplays';
import { login } from './login';
import { addGeekPlay } from './add-geekplay';
import { sleep } from './sleep';
import { compareGeekPlays } from './compare-geekplays';

export default {
	async scheduled(event, env, ctx): Promise<void> {
		console.log(`Process started: ${new Date()}`);
		const sourceGeekPlays = await getGeekPlays(env.BGG_SOURCE_USERNAME, env);
		const sourceGeekPlaysWithDestinationPlayer = sourceGeekPlays.filter((geekPlay) => {
			return geekPlay.players.some((player) => player.username === env.BGG_DESTINATION_USERNAME);
		});
		if (sourceGeekPlaysWithDestinationPlayer.length === 0) {
			console.log(`No plays found in ${env.BGG_DESTINATION_USERNAME}'s logged plays that include ${env.BGG_DESTINATION_USERNAME}`);
			return;
		}
		await sleep(env.THROTTLE_RATE_MS);
		const destinationGeekPlays = await getGeekPlays(env.BGG_DESTINATION_USERNAME, env);
		const missingGeekPlays = sourceGeekPlaysWithDestinationPlayer.filter((sourceGeekPlay) => {
			return !destinationGeekPlays.some((destinationGeekPlay) => {
				const areSame = compareGeekPlays(sourceGeekPlay, destinationGeekPlay);
				return areSame;
			});
		});
		if (missingGeekPlays.length === 0) {
			console.log(`No missing plays found in ${env.BGG_DESTINATION_USERNAME}'s logged plays that include ${env.BGG_DESTINATION_USERNAME}`);
			return;
		}
		console.log(`Missing plays found: ${missingGeekPlays.length}`);
		const geekPlaysToAdd = missingGeekPlays.slice(0, env.MAX_ADD_GEEKPLAY_REQUESTS);
		const cookies = await login(env);
		for (let geekPlay of geekPlaysToAdd) {
			await sleep(env.THROTTLE_RATE_MS);
			console.log(`Adding missing play for game ${geekPlay.item?.name} on ${geekPlay.date}`);
			await addGeekPlay(geekPlay, cookies, env);
			console.log('Play successfully added');
		}
		console.log(`Process completed: ${new Date()}`);
	},
} satisfies ExportedHandler<Env>;
