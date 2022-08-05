import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontistoIcon from '@expo/vector-icons/Fontisto';
import { useCurrentPosition, useWeather } from './lib/hooks';
import type { IconMapValue } from './lib/types';

const appId = Constants?.manifest?.extra?.appId;

function Weather() {
	const { coords, error: geoError } = useCurrentPosition();
	const { data, error: httpError } = useWeather({
		lat: coords?.latitude,
		lon: coords?.longitude,
		appId,
	});

	// when `data` is `null` it'll become `true`, it's to keep TypeScript happy
	const isLoading = !data;
	// get the reason error either from HTTP request or geo location
	const reasonError = httpError || geoError;
	// when `reasonError` is `undefined` it'll become `false`
	const hasError = !!reasonError;

	if (hasError) {
		return (
			<View className='flex-1 items-center justify-center bg-white'>
				<Text>Oops!</Text>
				<Text>{reasonError}</Text>
			</View>
		);
	}

	if (isLoading) {
		return (
			<View className='flex-1 items-center justify-center bg-white'>
				<Text>Loading...</Text>
			</View>
		);
	}

	return (
		<View className='flex-1 container mx-auto justify-around text-center'>
			<View className='flex-row-reverse px-6'>
				<Text>{data.time}</Text>
			</View>

			<View>
				<WeatherIcon icon={data.icon} />
				<Text className='font-bold text-3xl'>{data.temperature}</Text>
				<Text className='font-light mt-2'>{data.title}</Text>
			</View>

			<View className='items-center'>
				<View className='flex-row bg-gray-200 p-6 rounded-full'>
					<View className='px-4'>
						<Text className='font-semibold'>{data.wind}</Text>
						<Text className='font-light'>Wind</Text>
					</View>

					<View className='px-4'>
						<Text className='font-semibold'>{data.humidity}</Text>
						<Text className='font-light'>Humidity</Text>
					</View>

					<View className='px-4'>
						<Text className='font-semibold'>{data.cloud}</Text>
						<Text className='font-light'>Cloud</Text>
					</View>
				</View>
			</View>
		</View>
	);
}

function WeatherIcon({ icon = 'sunny' as IconMapValue }) {
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

export default function App() {
	return (
		<View className='flex-1 bg-gray-50 text-gray-900'>
			<Weather />
			<StatusBar style='auto' />
		</View>
	);
}
