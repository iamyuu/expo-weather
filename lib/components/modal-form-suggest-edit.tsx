import * as React from 'react';
import { Platform, View, Text, Modal, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useReducerState } from '../hooks';

interface ModalFormSuggestEditProps {
	isOpen: boolean;
	onClose: () => void;
}

type FormSuggestEditField = Record<'temperature' | 'description', string>;

const initialForm = {} as FormSuggestEditField;

function showAlert(message: string, type: 'Success' | 'Failed' = 'Success') {
	if (Platform.OS === 'web') alert(message);
	else Alert.alert(type, message);
}

export function ModalFormSuggestEdit(props: ModalFormSuggestEditProps) {
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [state, dispatch] = useReducerState<FormSuggestEditField>(initialForm);

	async function handleSuggestEdit() {
		setIsSubmitting(true);

		try {
			console.log(`🚀 ~ ModalFormSuggestEdit ~ state`, state);

			// fake async
			await new Promise(resolve => setTimeout(resolve, 1500));

			// reset form
			dispatch({ temperature: '', description: '' });

			// show success alert
			showAlert('Successfully submitted edit suggestions');

			props.onClose();
		} catch (error) {
			const reason = error instanceof Error ? error.message : 'Internal server error';

			// show error alert
			showAlert(reason, 'Failed');
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Modal animationType='slide' transparent={true} visible={props.isOpen} onRequestClose={props.onClose}>
			<View className='bg-gray-200 flex-1 justify-center items-center'>
				<View className='bg-white w-5/6 m-4 p-4 items-center space-y-6 rounded'>
					<TextInput
						keyboardType='numeric'
						placeholder='Temperature'
						value={state.temperature}
						onChangeText={newValue => dispatch({ temperature: newValue.replace(/[^0-9]/g, '') })}
						className='block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-gray-100 focus:outline-none'
					/>

					<TextInput
						placeholder='Description'
						value={state.description}
						onChangeText={newValue => dispatch({ description: newValue })}
						className='block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-gray-100 focus:outline-none'
					/>

					<View className='flex-row-reverse space-x-2 w-full'>
						<TouchableOpacity className={['items-center p-3 rounded bg-gray-900', isSubmitting ? 'opacity-50' : ''].join(' ')} disabled={isSubmitting} onPress={handleSuggestEdit}>
							<Text className='text-gray-100'>Suggest Edit</Text>
						</TouchableOpacity>

						<TouchableOpacity className={['items-center p-3 rounded', isSubmitting ? 'opacity-50' : ''].join(' ')} disabled={isSubmitting} onPress={props.onClose}>
							<Text className='text-gray-900'>Cancel</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}
