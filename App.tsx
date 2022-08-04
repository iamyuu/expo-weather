import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCurrentPosition, useWeather } from './lib/hooks';

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
			<View>
				<Text>Oops!</Text>
				<Text>{reasonError}</Text>
			</View>
		);
	}

	if (isLoading) {
		return <Text>Loading...</Text>;
	}

	return <Text>{JSON.stringify(data, null, 2)}</Text>;
}

export default function App() {
	return (
		<View className='flex-1 items-center justify-center bg-white'>
			<Weather />
			<StatusBar style='auto' />
		</View>
	);
}
