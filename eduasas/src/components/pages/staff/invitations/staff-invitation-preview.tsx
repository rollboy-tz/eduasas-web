import { useSchoolStaffInvitations, useSchoolStaffList } from "@/hooks/school";

export const StaffInvitationPreview = ({ invitationId } : { invitationId: string}) => {
    const { invitations, metrics: count, isLoading: loadingInvitations } = useSchoolStaffInvitations();
    const invitation = invitations.find(invitation => invitation.id === invitationId);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <h3>{invitation?.name}</h3>
        </div>
    )
}