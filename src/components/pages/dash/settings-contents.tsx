'use client'

import { SettingGroup, SettingItem } from "@/components/ui/settings-group-layout";
import { SettingSelect, SettingToggle, SettingTimeInput } from "@/components/control";
import { useUser } from "@/hooks/dash";
import { EduScreenLoader } from "@/components/ui";
import { useState } from "react";


export const SettingsContent = () => {
    const { settings, isLoading, updateSettings } = useUser()
    const [startTime, setStartTime] = useState(settings?.dndStartTime ?? "22:00");
    const [endTime, setEndTime] = useState(settings?.dndEndTime ?? "07:00");

    if (isLoading) {
        return (
            <EduScreenLoader />
        )
    }

    return (
        <div className="mx-auto max-w-5xl flex flex-col gap-6 px-3 py-4 sm:px-6 lg:px-8">

            <h1 className="text-2xl font-semibold">Settings</h1>

            {/* Notification Delivery */}
            <SettingGroup title="Notification Delivery">
                <SettingItem
                    title="Push Notifications"
                    description="Receive instant notifications in your browser or mobile device."
                    action={
                        <SettingToggle
                            checked={settings?.pushEnabled ?? false}
                            onChange={(value) => updateSettings({ pushEnabled: value })}
                        />
                    }
                />

                <SettingItem
                    title="Email Notifications"
                    description="Receive important notifications via email."
                    action={
                        <SettingToggle
                            checked={settings?.emailEnabled ?? false}
                            onChange={(value) => updateSettings({ emailEnabled: value })}
                        />
                    }
                />

                <SettingItem
                    title="SMS Notifications"
                    description="Receive important notifications via SMS."
                    action={
                        <SettingToggle
                            checked={settings?.smsEnabled ?? false}
                            onChange={(value) => updateSettings({ smsEnabled: value })}
                        />
                    }
                />
            </SettingGroup>

            {/* Preferences */}
            <SettingGroup title="Preferences">
                <SettingItem
                    title="Notification Language"
                    description="Choose the language used for notifications."
                    action={
                        <SettingSelect
                            value={settings?.language ?? "en"}
                            onChange={(value) => updateSettings({ language: value })}
                            options={[
                                { label: "English", value: "en" },
                                { label: "Swahili", value: "sw" },
                            ]}
                        />
                    }
                />
            </SettingGroup>

            {/* Do Not Disturb */}
            <SettingGroup title="Do Not Disturb">
                <SettingItem
                    title="Enable Do Not Disturb"
                    description="Pause notifications during selected hours."
                    action={
                        <SettingToggle
                            checked={settings?.dndEnabled ?? false}
                            onChange={(value) => updateSettings({ dndEnabled: value })}
                        />
                    }
                />

                {/* Hizi zionekane tu kama DND imewashwa */}
                <SettingItem
                    title="Start Time"
                    description="Time when Do Not Disturb starts."
                    action={
                        <SettingTimeInput
                            value={startTime}
                            onChange={setStartTime}
                            onBlur={() =>
                                updateSettings({
                                    dndStartTime: startTime,
                                })
                            }
                        />
                    }
                />

                <SettingItem
                    title="End Time"
                    description="Time when Do Not Disturb ends."
                    action={
                        <SettingTimeInput
                            value={endTime}
                            onChange={setEndTime}
                            onBlur={() =>
                                updateSettings({
                                    dndEndTime: endTime,
                                })
                            }
                        />
                    }
                />
            </SettingGroup>

            {/* Notification Categories */}
            <SettingGroup title="Notification Categories">

                <SettingItem
                    title="Academic Notifications"
                    description="Choose where academic updates are delivered."
                    action={
                        <SettingSelect
                            multiple
                            value={settings?.academicChannels ?? []}
                            onChange={(values) => {
                                updateSettings({
                                    academicChannels: values,
                                });
                            }}
                            options={[
                                {
                                    label: "Dashboard",
                                    value: "DASHBOARD",
                                },
                                {
                                    label: "Email",
                                    value: "EMAIL",
                                },
                                {
                                    label: "SMS",
                                    value: "SMS",
                                },
                            ]}
                        />
                    }
                />



                <SettingItem
                    title="Payment Notifications"
                    description="Choose where payment updates are delivered."
                    action={
                        <SettingSelect
                            multiple
                            value={settings?.paymentChannels ?? []}
                            onChange={(values) => {
                                updateSettings({
                                    paymentChannels: values,
                                });
                            }}
                            options={[
                                {
                                    label: "Dashboard",
                                    value: "DASHBOARD",
                                },
                                {
                                    label: "Email",
                                    value: "EMAIL",
                                },
                                {
                                    label: "SMS",
                                    value: "SMS",
                                },
                            ]}
                        />
                    }
                />



                <SettingItem
                    title="System Notifications"
                    description="Choose where system updates are delivered."
                    action={
                        <SettingSelect
                            multiple
                            value={settings?.systemChannels ?? []}
                            onChange={(values) => {
                                updateSettings({
                                    systemChannels: values,
                                });
                            }}
                            options={[
                                {
                                    label: "Dashboard",
                                    value: "DASHBOARD",
                                },
                                {
                                    label: "Email",
                                    value: "EMAIL",
                                },
                                {
                                    label: "SMS",
                                    value: "SMS",
                                },
                            ]}
                        />
                    }
                />

            </SettingGroup>

        </div>
    )
}