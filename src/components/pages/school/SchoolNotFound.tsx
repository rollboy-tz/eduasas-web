import { JSX } from "react/jsx-runtime";
import { useSchoolStaffInvitations } from "@/hooks/school";
export const SchoolNotFound = (): JSX.Element => {

    const { sendInvitation } = useSchoolStaffInvitations();
    return(
        <div>
            <h3>School not Found</h3>
        </div>
    )
}