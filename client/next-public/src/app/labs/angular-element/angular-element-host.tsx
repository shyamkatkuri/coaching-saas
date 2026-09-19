'use client';

import {
    useEffect,
    useRef,
    useState,
} from 'react';

function loadModule(
    src: string,
): Promise<void> {

    return new Promise(
        (
            resolve,
            reject,
        ) => {

            const existing =
                document.querySelector(
                    `script[src="${src}"]`,
                );

            if (existing) {

                resolve();

                return;
            }

            const script =
                document.createElement(
                    'script',
                );

            script.src =
                src;

            script.type =
                'module';

            script.onload =
                () =>
                    resolve();

            script.onerror =
                () =>
                    reject(
                        new Error(
                            `Failed to load ${src}`,
                        ),
                    );

            document.head.appendChild(
                script,
            );
        },
    );
}

export default function AngularElementHost() {

    const host =
        useRef<HTMLDivElement>(
            null,
        );

    const [
        selectedCourse,
        setSelectedCourse,
    ] =
        useState<string | null>(
            null,
        );

    useEffect(
        () => {

            let element:
                HTMLElement | null =
                null;

            async function load() {

                try {

                    await loadModule(
                        'http://localhost:4205/polyfills.js',
                    );

                    await loadModule(
                        'http://localhost:4205/main.js',
                    );

                    await customElements.whenDefined(
                        'coaching-course-card',
                    );

                    element =
                        document.createElement(
                            'coaching-course-card',
                        );

                    element.setAttribute(
                        'institute-name',
                        'ABC Coaching',
                    );

                    element.addEventListener(
                        'courseSelected',
                        (
                            event: Event,
                        ) => {

                            const customEvent =
                                event as CustomEvent<string>;

                            setSelectedCourse(
                                customEvent.detail,
                            );

                        },
                    );

                    host.current?.appendChild(
                        element,
                    );

                } catch (error) {

                    console.error(
                        'Angular widget failed',
                        error,
                    );

                }

            }

            void load();

            return () => {

                element?.remove();

            };

        },
        [],
    );

    return (
        <section>

            <h1>
                Next.js hosting Angular
            </h1>

            <div
                ref={host}
            />

            {selectedCourse && (
                <p>
                    Next.js received:
                    {' '}
                    {selectedCourse}
                </p>
            )}

        </section>
    );
}