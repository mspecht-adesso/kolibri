import { Theme } from '@a11y-ui/core';

enum TagEnum {
	'abbr',
	'accordion',
	'accordion-group', // TODO: github pr link
	'alert',
	'avatar', // TODO: github pr link
	'badge',
	'breadcrumb',
	'button',
	'button-group',
	'button-link',
	'card',
	'details',
	'dialog', // TODO: github pr link
	'dropdown', // TODO: github pr link
	'form',
	'heading',
	'icon',
	'image', // TODO: github pr link
	'indented-text',
	'input-checkbox',
	'input-color',
	'input-date',
	'input-file',
	'input-email',
	'input-number',
	'input-password',
	'input-radio',
	'input-range',
	'input-text',
	'link',
	'link-button',
	'link-group',
	'modal',
	'nav',
	'pagination',
	'popover', // TODO: github pr link
	'progress',
	'select',
	'separator', // TODO: github pr link
	'skip-nav',
	'spin',
	'symbol',
	'table',
	'tabs',
	'textarea',
	'toast',
	'toolbar', // TODO: github pr link
	'tooltip',
}

enum KeyEnum {
	'alert-error-label',
	'alert-info-label',
	'alert-warning-label',
	'alert-success-label',
	'form-required-advise',
	'link-target-advise',
	'logo-label',
	'nav-label-close',
	'nav-label-open',
	'pagination-label-first',
	'pagination-label-last',
	'pagination-label-next',
	'pagination-label-previous',
	'pagination-label-current',
	'spin-label-busy',
	'spin-label-finished',
	'table-button-sort-label',
	'table-pagination-label',
	'table-pagination-sites-no',
	'table-pagination-sites-yes',
	'tabs-button-add-label',
	'tabs-button-close-label',
	'toast-button-close-label',
}

export const KoliBri = new Theme<'kol', keyof typeof KeyEnum, keyof typeof TagEnum>('kol', KeyEnum, TagEnum);

export { THEMING_ICON_FONT_CSS_FONT_AWESOME } from './fonts';
