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
				case 'ar-SA':
					translations = await import('../../locales/ar-SA.js');
					break;
				case 'cy-GB':
					translations = await import('../../locales/cy-GB.js');
					break;
				case 'da-DK':
					translations = await import('../../locales/da-DK.js');
					break;
				case 'de-DE':
					translations = await import('../../locales/de-DE.js');
					break;
				case 'es-ES':
					translations = await import('../../locales/es-ES.js');
					break;
				case 'es-MX':
					translations = await import('../../locales/es-MX.js');
					break;
				case 'fr-CA':
					translations = await import('../../locales/fr-CA.js');
					break;
				case 'fr-FR':
					translations = await import('../../locales/fr-FR.js');
					break;
				case 'fr-ON':
					translations = await import('../../locales/fr-ON.js');
					break;
				case 'ja-JP':
					translations = await import('../../locales/ja-JP.js');
					break;
				case 'ko-KR':
					translations = await import('../../locales/ko-KR.js');
					break;
				case 'nl-NL':
					translations = await import('../../locales/nl-NL.js');
					break;
				case 'pt-BR':
					translations = await import('../../locales/pt-BR.js');
					break;
				case 'sv-SE':
					translations = await import('../../locales/sv-SE.js');
					break;
				case 'tr-TR':
					translations = await import('../../locales/tr-TR.js');
					break;
				case 'zh-CN':
					translations = await import('../../locales/zh-CN.js');
					break;
				case 'zh-TW':
					translations = await import('../../locales/zh-TW.js');
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
