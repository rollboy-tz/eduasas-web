import { RegisteredSubject,  } from "@/types/school";

interface SubjectProps {
    subjects: RegisteredSubject[];
}

export function SubjectsContainer({ subjects }: SubjectProps) {
    return (
        <div>{subjects.length}</div>
    )
} 