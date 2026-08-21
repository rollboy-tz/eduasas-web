import { Metadata } from 'next';
import { text } from '@/lib/string';
import { SchoolProfileResponse } from '@/types/dash';
import { SchoolNotFound } from '@/components/pages/school/SchoolNotFound';

interface Props {
    children: React.ReactNode;
    params: Promise<{ school: string }>;
}

async function getSchoolData(schoolSlug: string): Promise<SchoolProfileResponse | null> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.eduasas.co.tz";

    try {
        const res = await fetch(`${baseUrl}/main/public/school-profile?slug=${schoolSlug}`, {
            cache: 'no-store',
        });

        if (!res.ok) {
            return null;
        }

        return await res.json();
    } catch (error) {
        return null;
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { school } = await params;
    const schoolData = await getSchoolData(school);

    if (!schoolData) {
        return {
            title: {
                default: 'School',
                template: "%s | EduAsas"
            },
            description: "Easly manage you school in EduAsas AI Driven Schoom Management System"
        };
    }

    const schoolName = text.titleCase(schoolData.data.displayName) || text.titleCase(schoolData.data.name);

    return {
        title: {
            default: `${schoolName}`,
            template: `%s - ${schoolName} | EduAsas`, // Ongeza | EduAsas hapa
        },
        description: "Knowledge is power, but education is the flame that lights the way.",
    };
}

export default async function SchoolLayout({ children, params }: Props) {
    const { school } = await params;
    const schoolData = await getSchoolData(school);

    if (!schoolData) {
        return (
            <main>
                <SchoolNotFound />
            </main>
        );
    }

    return <>{children}</>;
}