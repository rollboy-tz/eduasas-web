
type SectionStream = {
    id: string;
    name: string;
    code: string;
}

type Sections = {
    id: string;
    name: string;
    streamId: string;
    stream: SectionStream | null;
    capacity: number;
    currentStudents: number;
    availableSlots: number;
    classTeacher: null;
    timestamps: {
        createdAt: string;
        updatedAt: string;
    }
}