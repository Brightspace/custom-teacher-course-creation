import { html, LitElement } from 'lit-element/lit-element';
import { BaseMixin } from '../src/mixins/base-mixin';

class CreateCourseIllustration extends BaseMixin(LitElement) {

	render() {
		return html`
		<img src="../images/create-course-illustration.svg" alt=${this.localize('welcomeIllustrationAlt')}>
		`;
	}
}
customElements.define('tcc-create-course-illustration', CreateCourseIllustration);
