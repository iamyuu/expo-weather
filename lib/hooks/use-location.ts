import * as React from 'react';
import * as Location from 'expo-location';
import type { LocationObject } from 'expo-location';

/**
 * Custom hooks for get current user location
 *
 * @example
 * ```
 * const { coords, error } = useCurrentPosition()
 * ```
 */
export function useCurrentPosition() {
	const [error, setError] = React.useState<string>();
	const [location, setLocation] = React.useState<LocationObject>();

	React.useEffect(() => {
		async function getCurrentPosition() {
			try {
				// request permission to access location
				const permission = await Location.requestForegroundPermissionsAsync();

				// if location was denied, throw the message
				if (!permission.granted) {
					throw new Error('Permission to access location was denied');
				}

				// after location granted, get current user location
				const currentLocation = await Location.getCurrentPositionAsync();

				setLocation(currentLocation);
			} catch (error) {
				// catch any error
				const reason = error instanceof Error ? error.message : 'Unknown error';

				setError(reason);
			}
		}

		getCurrentPosition();
	}, []);

	return { ...location, error };
}
