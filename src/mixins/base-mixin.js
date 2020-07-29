import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin';

const baseUrl = import.meta.url;
const langTerms = {};
export const BaseMixin = superclass => class extends RtlMixin(LocalizeMixin(superclass)) {
	static async getLocalizeResources(langs) {
		for (let lang of langs) {
			if (!lang) {
				continue;
			}
			lang = lang.toLowerCase();
			lang = lang.split('-')[0];
			const langTermRelativeUrl = `../../locales/${lang}.js`;
			const langTermUrl = `${new URL(langTermRelativeUrl, baseUrl)}`;
			if (langTerms[langTermUrl]) {
				return await langTerms[langTermUrl];
			}

			langTerms[langTermUrl] = (async() => {
				const langResources = await import(langTermUrl);

				if (!langResources) {
					return;
				}

				return {
					language: lang,
					resources: langResources.val
				};
			})();

			return await langTerms[langTermUrl];
		}

		return null;
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
