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
