import * as React from 'react';
import { humaniseSunrise, formatTime } from '../utils/formatter';
import type { Weather, RawWeather, Coord } from '../types';

const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

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
				const apiEndpoint = new URL(API_URL);
				apiEndpoint.searchParams.append('appid', options.appId);

				if (options.lat) {
					// since `lat` is a number, we need to convert it to string so we can use the `append` method
					apiEndpoint.searchParams.append('lat', options.lat?.toString());
				}

				if (options.lon) {
					// since `lon` is a number, we need to convert it to string so we can use the `append` method
					apiEndpoint.searchParams.append('lon', options.lon?.toString());
				}

				const response = await fetch(apiEndpoint);
				const responseJSON = (await response.json()) as unknown as RawWeather;

				dispatch({
					status: 'resolved',
					data: transform(responseJSON),
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
export function transform(rawData: RawWeather): Weather {
	const [weather] = rawData.weather;

	return {
		title: weather.description,
		time: formatTime(rawData.dt),
		wind: `${rawData.wind.speed} km/h`,
		humidity: `${rawData.main.humidity}%`,
		sunrise: humaniseSunrise(rawData.sys.sunrise),
		temperature: `${rawData.main.temp}°C`,
		locationName: rawData.name,
		icon: iconsMap[weather.icon] ?? 'sunny',
	};
}

// https://github.com/farahat80/react-open-weather/blob/master/src/js/providers/openweather/iconsMap.js#L3-L22
const iconsMap: Record<string, string> = {
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
