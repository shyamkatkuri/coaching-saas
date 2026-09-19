import type {
    Metadata,
} from 'next';

export const metadata:
    Metadata = {
    title:
        'Features',

    description:
        'Student, course, batch, attendance and fee management for coaching institutes.',
};

export default function FeaturesPage() {
    return (
        <main>
            <h1>
                Platform Features
            </h1>

            <ul>
                <li>
                    Student Management
                </li>

                <li>
                    Course Management
                </li>

                <li>
                    Batch Management
                </li>

                <li>
                    Attendance
                </li>

                <li>
                    Fee Management
                </li>

                <li>
                    Reports
                </li>
            </ul>
        </main>
    );
}