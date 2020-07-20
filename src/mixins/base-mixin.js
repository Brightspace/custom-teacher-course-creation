import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin';

const langTerms = {};
const baseUrl = import.meta.url;

export const BaseMixin = superclass => class extends RtlMixin(LocalizeMixin(superclass)) {
	static async getLocalizeResources(langs) {
		const langPaths = {
			'en-us': '../../locales/en.js',
			'en': '../../locales/en.js'
		};

		for (const lang of langs) {
			const langPath = langPaths[lang];
			if (langPath) {
				const langResources = await import(langPath);
				if (langResources) {
					return {
						language: lang,
						resources: langResources.val
					};
				}
			}
		}

		return null;
	}

	localize(key, params) {
		return super.localize(key, params) || `{language term '${key}' not found}`;
	}
};
