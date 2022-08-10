export interface Weather {
	icon: IconMapValue;
	time: string;
	wind: string;
	cloud: string;
	humidity: string;
	temperature: string;
	description: string;
}

export interface ResponseWeather {
	lat: number;
	lon: number;
	timezone: string;
	timezone_offset: number;
	current: RawWeather;
	hourly: RawWeather[];
}

export interface RawWeather {
	dt: number;
	sunrise?: number;
	sunset?: number;
	temp: number;
	feels_like: number;
	pressure: number;
	humidity: number;
	dew_point: number;
	uvi: number;
	clouds: number;
	visibility: number;
	wind_speed: number;
	wind_deg: number;
	wind_gust: number;
	pop?: number;
	rain?: Record<string, number>;
	weather: Array<{
		id: number;
		main: string;
		description: string;
		icon: string;
	}>;
}

export interface Coord {
	lon: number;
	lat: number;
}

export type IconMapValue = 'sunny' | 'cloudy' | 'showers' | 'rain' | 'thunderstorms' | 'windySnow' | 'fog';
