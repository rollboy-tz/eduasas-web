import { Metadata } from 'next';
import { text } from '@/lib/string';
import { notFound } from 'next/navigation';
import { SchoolProfileResponse } from '@/types/dash';
import { SchoolNotFound } from '@/components/pages/school/SchoolNotFound';

interface Props {
    children: React.ReactNode;
    params: Promise<{ school: string }>;
}

async function getSchoolData(schoolSlug: string): Promise<SchoolProfileResponse | null> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "api.eduasas.co.tz";

    if (!baseUrl) {
        notFound();
    }

    try {
        const res = await fetch(`${baseUrl}/main/public/school-profile?slug=${schoolSlug}`, {
            cache: 'no-store',
        });

        if (!res.ok) {
            return null;
        }

        const data: SchoolProfileResponse = await res.json();
        return data;
    } catch (error) {
        return null;
    }
}

// 1. Dynamic Metadata Generation
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { school } = await params;
    const schoolData = await getSchoolData(school);

    if (!schoolData) {
        return { title: 'School Not Found' };
    }

    return {
        title: text.titleCase(schoolData.data.displayName) || text.titleCase(schoolData.data.name),
        description: "Knowledge is power, but education is the flame that lights the way.",
    };
}

export default async function SchoolLayout({ children, params }: Props) {
    // Kwenye Next.js 15+, params lazima ziwe awaited
    const { school } = await params;

    const schoolData = await getSchoolData(school);

    if (!schoolData) {
        return (
            <main>
                <SchoolNotFound />
            </main>)
    }

    return (<>{children}</>);
}