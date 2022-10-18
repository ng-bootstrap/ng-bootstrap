import { offset as offsetModifier, Options } from '@popperjs/core';

export function addPopperOffset(offset: number[]) {
	return (options: Partial<Options>) => {
		options.modifiers!.push(offsetModifier, {
			name: 'offset',
			options: {
				offset: () => offset,
			},
		});

		return options;
	};
}
