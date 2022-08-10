import * as React from 'react';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TouchableOpacity } from 'react-native';
import { WeatherIcon, ModalFormSuggestEdit } from './lib/components';
import { useCurrentPosition, useWeather } from './lib/hooks';

const appId = Constants?.manifest?.extra?.appId;
const additioinalInfo = ['wind', 'humidity', 'cloud'] as const;

function Weather() {
	const [isOpenModal, toggleModal] = React.useReducer(prevState => !prevState, false);
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
			<View className='flex-1 items-center justify-center'>
				<Text>Oops!</Text>
				<Text>{reasonError}</Text>
			</View>
		);
	}

	if (isLoading) {
		return (
			<View className='flex-1 items-center justify-center'>
				<Text>Loading...</Text>
			</View>
		);
	}

	return (
		<View className='flex-1 container justify-around'>
			<View className='flex-row-reverse px-6'>
				<Text>{data.time}</Text>
			</View>

			<View className='mx-auto'>
				<WeatherIcon icon={data.icon} />
				<Text className='font-bold text-3xl text-center'>{data.temperature}</Text>
				<Text className='font-light mt-2 text-center'>{data.description}</Text>
			</View>

			<View className='items-center space-y-4'>
				<View className='bg-gray-200 flex-row space-x-12 p-6 rounded-full'>
					{additioinalInfo.map(val => (
						<View key={val}>
							<Text className='font-semibold text-center'>{data[val]}</Text>
							<Text className='font-light capitalize text-center'>{val}</Text>
						</View>
					))}
				</View>

				<View className='flex-row space-x-2'>
					<TouchableOpacity className='items-center p-3 rounded bg-gray-900' onPress={toggleModal}>
						<Text className='text-gray-100'>Suggest Edit</Text>
					</TouchableOpacity>
				</View>
			</View>

			<ModalFormSuggestEdit {...{ isOpen: isOpenModal, onClose: toggleModal }} />
		</View>
	);
}

export default function App() {
	return (
		<View className='flex-1 bg-gray-50 text-gray-900'>
			<Weather />
			<StatusBar style='auto' />
		</View>
	);
}
