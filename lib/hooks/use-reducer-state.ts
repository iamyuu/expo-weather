import * as React from 'react';

/**
 * Custom hooks for handling object state
 */
export function useReducerState<TData>(initialState: TData) {
	return React.useReducer(
		(state: TData, newState: Partial<TData>) => ({
			...state,
			...newState,
		}),
		initialState,
	);
}
