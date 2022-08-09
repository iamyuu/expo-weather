import * as React from 'react';
import { formatTime } from '../utils/formatter';
import type { Weather, ResponseWeather, Coord, IconMapValue } from '../types';

const API_URL = 'https://api.openweathermap.org/data/2.5';

type UseWeatherOptions = Partial<Coord> & { appId: string };

interface UseWeatherState {
	status: 'idle' | 'pending' | 'resolved' | 'rejected';
	data: Weather | null;
	error: string | null;
}

const initialState: UseWeatherState = {
	status: 'idle',
	data: null,
	error: null,
};

/**
 * Custom hooks for fetching weather data
 *
 * @example
 * ```
 * const { status, data, error } = useWeather({ lat: 0, lon: 0 })
 * ```
 */
export function useWeather(options: UseWeatherOptions) {
	// using reducer for the state to make it easy to update the state
	const [state, dispatch] = React.useReducer(
		(state: UseWeatherState, newState: Partial<UseWeatherState>) => ({
			...state,
			...newState,
		}),
		initialState,
	);

	React.useEffect(() => {
		async function doFetch() {
			// reset the state before fetching the data and update status to `pending`
			dispatch({ ...initialState, status: 'pending' });

			try {
				// convert the api url to `URL` to make append search params easy and readable
				const apiEndpoint = new URL('/onecall', API_URL);
				apiEndpoint.searchParams.append('appid', options.appId);
				apiEndpoint.searchParams.append('units', 'metric');
				apiEndpoint.searchParams.append('exclude', ['minutely', 'daily', 'alerts'].join(','));

				if (options.lat) {
					// since `lat` is a number, we need to convert it to string so we can use the `append` method
					apiEndpoint.searchParams.append('lat', options.lat?.toString());
				}

				if (options.lon) {
					// since `lon` is a number, we need to convert it to string so we can use the `append` method
					apiEndpoint.searchParams.append('lon', options.lon?.toString());
				}

				const response = await fetch(apiEndpoint);
				const responseJSON = (await response.json()) as unknown as ResponseWeather;

				dispatch({
					status: 'resolved',
					data: transform(responseJSON.current),
					error: null,
				});
			} catch (error) {
				// catch any error
				const reason = error instanceof Error ? error.message : 'Internal server error';

				dispatch({ status: 'rejected', data: null, error: reason });
			}
		}

		// start fetching when `lat` and `lon` provided
		if (options.lat && options.lon) {
			doFetch();
		}
	}, [options.appId, options.lat, options.lon]);

	return state;
}

/**
 * Transforming OpenWeather response
 */
export function transform(rawData: ResponseWeather['current']): Weather {
	const [weather] = rawData.weather;

	return {
		title: weather.description,
		cloud: `${rawData.clouds}%`,
		time: formatTime(rawData.dt),
		wind: `${rawData.wind_speed} km/h`,
		humidity: `${rawData.humidity}%`,
		temperature: `${Math.ceil(rawData.temp)}°C`,
		icon: iconsMap[weather.icon] ?? 'sunny',
	};
}

// https://github.com/farahat80/react-open-weather/blob/master/src/js/providers/openweather/iconsMap.js#L3-L22
const iconsMap: Record<string, IconMapValue> = {
	'01d': 'sunny',
	'02d': 'cloudy',
	'03d': 'cloudy',
	'04d': 'cloudy',
	'09d': 'showers',
	'10d': 'rain',
	'11d': 'thunderstorms',
	'13d': 'windySnow',
	'50d': 'fog',
	'01n': 'sunny',
	'02n': 'cloudy',
	'03n': 'cloudy',
	'04n': 'cloudy',
	'09n': 'showers',
	'10n': 'rain',
	'11n': 'thunderstorms',
	'13n': 'windySnow',
	'50n': 'fog',
};
