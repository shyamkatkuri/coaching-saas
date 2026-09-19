'use client';

export default function NextWidget() {

    function selectCourse() {

        window.parent.postMessage(
            {
                type:
                    'NEXT_COURSE_SELECTED',

                payload: {
                    courseId:
                        'python-fastapi',
                },
            },

            'http://localhost:4200',
        );

    }

    return (
        <section>

            <h2>
                Next.js Course Recommendation
            </h2>

            <p>
                Python + FastAPI
            </p>

            <button
                type="button"
                onClick={selectCourse}
            >

                Select Course

            </button>

        </section>
    );
}