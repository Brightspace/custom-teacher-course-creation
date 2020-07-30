import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin';

export const BaseMixin = superclass => class extends RtlMixin(LocalizeMixin(superclass)) {
	static async getLocalizeResources(langs) {
		let translations;
		for await (const lang of langs) {
			switch (lang) {
				case 'en':
					translations = await import('../../locales/en.js');
					break;
				case 'en-US':
					translations = await import('../../locales/en.js');
					break;
			}
			if (translations && translations.val) {
				return {
					language: lang,
					resources: translations.val
				};
			}
		}
		translations = await import('../../locales/en.js');
		return {
			language: 'en',
			resources: translations.val
		};
	}

	localize(key, params) {
		return super.localize(key, params) || `{language term '${key}' not found}`;
	}

	changePage(page, pageData) {
		const changePageEvent = new CustomEvent('change-page', {
			detail: {
				page,
				pageData
			},
			bubbles: true,
			composed: true
		});
		this.dispatchEvent(changePageEvent);
	}
};
