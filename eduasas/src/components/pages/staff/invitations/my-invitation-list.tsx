// src/components/pages/invitations/invitations-list.tsx
"use client";

import { useState } from "react";
import { UserStaffInvitation } from "@/types/users";
import { Archive, School, X, Check, MoreHorizontal } from "lucide-react";
import { api }  from "@/lib/api";

interface InviteCardProps {
    invitations: UserStaffInvitation[];
    onActionSuccess?: () => void;
    handleAccept: (id: string, token: string) => Promise<void>;
    handleDecline: (id: string, token: string) => Promise<void>;
    handleArchive: (id: string) => Promise<void>;
    handleUnArchive: (id: string) => Promise<void>;
}

export const InvitationsList = (
    { 
        invitations, 
        onActionSuccess, 
        handleAccept, 
        handleDecline, 
        handleArchive, 
        handleUnArchive 
    }: InviteCardProps) => {
    const [activeActionId, setActiveActionId] = useState<string | null>(null);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleAction = async (id: string, endpoint: string, token?: string) => {
        setLoadingId(id);

        try {
            if (endpoint === "accept") {
                // 1. Kwa Accept tunatumia POST na tunatuma TOKEN kwenye body
                await api.post(`/my/staff/invitations/accept`, { token });
            } else {
                // 2. Kwa Reject au Archive tunatumia PATCH na hatuhitaji token
                await api.patch(`/my/staff/invitations/${endpoint}/${id}`);
            }

            setActiveActionId(null);
            if (onActionSuccess) onActionSuccess();

            // Hapa unaweza kuongeza toast notification ya mafanikio
            console.log(`Invitation ${endpoint}ed successfully`);

        } catch (error) {
            console.error(`Failed to ${endpoint} invitation`, error);
            // Hapa unaweza kuonyesha toast ya error kwa user
        } finally {
            setLoadingId(null);
        }
    };

    return (
        // Umetumia 'table-striped' style kwenye globals.css, hapa tunaiiga kwa kutumia data-list ya kitalamu
        <div className="w-full flex flex-col border-t border-b border-border/60 bg-card rounded-sm overflow-hidden">
            {invitations.map((invite) => {
                const isPending = invite.status === "PENDING";
                const isActionOpen = activeActionId === invite.id;
                const isLoading = loadingId === invite.id;

                return (
                    <div
                        key={invite.id}
                        // 'even:bg-secondary/20' inaleta ule muundo wako wa stripe (nth:even) bila kelele
                        className="group relative w-full flex flex-col p-5 md:p-6 even:bg-secondary/20 border-b border-border/40 last:border-0 hover:bg-item-hover transition-smooth duration-250"
                    >
                        {/* ROW 1: SCHOOL NAME, ROLE & STATUS, EXPIRES (COMPACT BLOCK) */}
                        <div className="flex items-start justify-between gap-4 w-full">
                            {/* Kushoto: Icon + Name & Role */}
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0">
                                    <School className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <h3 className="text-sm md:text-base font-black text-foreground truncate leading-tight">
                                        {invite.school.name}
                                    </h3>
                                    {/* 'text-muted' kutoka tokens zako */}
                                    <p className="font-bold text-[12px] text-muted truncate mt-0.5">
                                        {invite.role.name}
                                    </p>
                                </div>
                            </div>

                            {/* Kulia: Status + Expiry Date */}
                            <div className="flex flex-col items-end gap-1 flex-shrink-0 text-right">
                                <span className={`badge flex-shrink-0 ${isPending ? "badge-info-solid" :
                                    invite.status === "JOINED" ? "badge-success-solid" : "badge-destructive-solid"
                                    }`}>
                                    {invite.status}
                                </span>
                                <span className="text-[10px] text-muted-foreground/80 font-medium">
                                    <span className="text-[9px] opacity-60 mr-0.5">Exp:</span>
                                    {new Date(invite.expiresAt).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                        </div>

                        {/* ROW 2 (ON HOVER): DESCRIPTION & TAKE ACTION BUTTONS */}
                        <div className="mt-0 opacity-0 max-h-0 overflow-hidden group-hover:opacity-100 group-hover:max-h-60 group-hover:mt-4 group-hover:pt-4 group-hover:border-t group-hover:border-border/40 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-400 ease-in-out">

                            {/* Description (Kushoto) */}
                            <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
                                {invite.description || `This invitation grants you access to join the ${invite.school.name} staff portal as ${invite.role.name}. Please review the request before action.`}
                            </p>

                            {/* Actions System (Kulia) */}
                            <div className="flex items-center justify-end gap-2 flex-shrink-0 w-full md:w-auto">
                                {isPending && !isLoading && (
                                    <>
                                        {/* BUTTON YA KWANZA: TAKE ACTION */}
                                        {!isActionOpen ? (
                                            <button
                                                onClick={() => setActiveActionId(invite.id)}
                                                className="w-full md:w-auto bg-foreground text-background text-xs font-black px-5 py-2.5 rounded-md hover:opacity-90 active:scale-95 shadow-xs transition-smooth"
                                            >
                                                Take Action
                                            </button>
                                        ) : (
                                            /* FULL BUTTONS ZENYE TEXT NA ICONS (RESPONSIVE) */
                                            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto animate-in fade-in slide-in-from-bottom-2 duration-250">
                                                {/* Accept Button - Inapitisha Token sasa hivi */}
                                                <button
                                                    onClick={() => handleAccept(invite.id, invite.token)}
                                                    className="flex items-center justify-center gap-1.5 bg-success text-white text-xs font-bold px-4 py-2.5 rounded-md hover:bg-success/90 transition-colors shadow-xs flex-1 md:flex-initial"
                                                >
                                                    <Check className="w-3.5 h-3.5" />
                                                    <span>Accept</span>
                                                </button>

                                                {/* Reject Button - Inapiga PATCH */}
                                                <button
                                                    onClick={() => handleDecline(invite.id, invite.token)}
                                                    className="flex items-center justify-center gap-1.5 border border-destructive/30 hover:border-destructive text-destructive text-xs font-bold px-4 py-2.5 rounded-md hover:bg-destructive/5 transition-colors flex-1 md:flex-initial"
                                                >
                                                    <X className="w-3.5 h-3.5 text-destructive" />
                                                    <span>Reject</span>
                                                </button>

                                                {/* Archive Button - Inapiga PATCH */}
                                                <button
                                                    onClick={() => handleArchive(invite.id)}
                                                    className="flex items-center justify-center gap-1.5 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-2.5 rounded-md hover:bg-secondary-hover transition-colors"
                                                    title="Archive"
                                                >
                                                    <Archive className="w-3.5 h-3.5" />
                                                    <span className="md:hidden lg:inline">Archive</span>
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* LOADING STATE */}
                                {isLoading && (
                                    <div className="text-xs text-muted-foreground font-bold animate-pulse py-2 flex items-center gap-2">
                                        <div className="h-3 w-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        <span>Processing request...</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};