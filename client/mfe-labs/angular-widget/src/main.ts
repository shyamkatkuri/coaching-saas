import {
    createApplication,
} from '@angular/platform-browser';

import {
    createCustomElement,
} from '@angular/elements';

import {
    Injector,
} from '@angular/core';

import {
    CourseCardComponent,
} from './app/course-card.component';

async function bootstrap() {

    const app =
        await createApplication();

    const element =
        createCustomElement(
            CourseCardComponent,
            {
                injector:
                    app.injector as Injector,
            },
        );

    if (
        !customElements.get(
            'coaching-course-card',
        )
    ) {

        customElements.define(
            'coaching-course-card',
            element,
        );

    }
}

bootstrap();