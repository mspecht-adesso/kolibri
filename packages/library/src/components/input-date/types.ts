import { Generic } from '@a11y-ui/core';
import { InputTypeOnDefault } from '../../components';
import { InputDateType, OptionalInputProps } from '../../types/input/control/number';
import { Iso8601 } from '../../types/input/iso8601';
import { InputRequiredProps } from '../input-text/types';

/**
 * API
 */
type RequiredProps = InputRequiredProps;
type OptionalProps = OptionalInputProps<Iso8601 | Date> & { type: InputDateType };

type RequiredStates = unknown;

type OptionalStates = {
	on: InputTypeOnDefault;
	max: Iso8601;
	min: Iso8601;
	value: Iso8601 | null;
};

// export type Props = Generic.Element.Members<RequiredProps, OptionalInputProps<IsoDate>>;

export type States = Generic.Element.Members<RequiredStates, OptionalStates>;

export type ComponentApi = Generic.Element.Members<RequiredProps, OptionalProps>;
