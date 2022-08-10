import * as React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontistoIcon from '@expo/vector-icons/Fontisto';
import type { IconMapValue } from '../types';

export function WeatherIcon({ icon = 'sunny' as IconMapValue }) {
	const iconSize = 96;

	switch (icon) {
		case 'sunny':
			return <FontistoIcon size={iconSize} name='day-sunny' />;

		case 'cloudy':
			return <FontistoIcon size={iconSize} name='cloudy' />;

		case 'showers':
		case 'rain':
			return <FontistoIcon size={iconSize} name='rain' />;

		case 'thunderstorms':
			return <Ionicons size={iconSize} name='thunderstorm-outline' />;

		case 'windySnow':
			return <FontistoIcon size={iconSize} name='snowflake' />;

		case 'fog':
			return <FontistoIcon size={iconSize} name='fog' />;

		default:
			return null;
	}
}
