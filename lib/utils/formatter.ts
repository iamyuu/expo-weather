const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

/**
 * Formatting raw timestamp to `Date`
 */
// get the correct date by multiply it with `1000`
const timestampToDate = (rawTimestamp: number) => new Date(rawTimestamp * 1000);

/**
 * Formatting time to `HH:mm`
 */
export function formatTime(rawTimestamp: number) {
	return timestampToDate(rawTimestamp).toLocaleString('en-GB', {
		timeStyle: 'short',
	});
}

/**
 * Humanise sunrise time (e.g. `1h`)
 */
export function humaniseSunrise(rawTimestamp: number) {
	const diff = timestampToDate(rawTimestamp).getTime() - Date.now();
	const hour = Math.round((diff % DAY) / HOUR);

	return `${hour}h`;
}
