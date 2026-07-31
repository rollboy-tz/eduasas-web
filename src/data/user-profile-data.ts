import { UserProfileResponse } from "@/types/dash/user-profile";

// Response Mock inayofuata 100% exact Types zako za rasmi
const MOCK_USER_PROFILE_DATA: UserProfileResponse = {
  profile: {
    id: "01KYTBWQ8Z24CH45JN5N7MCQ94",
    uid: "EAU-260730001",
    email: "jamilajohn@eduasas.co.tz",
    phone: null,
    firstName: "Jamila",
    secondName: null,
    lastName: "John",
    displayName: null,
    gender: null,
    picture: null,
    nationality: null,
    systemRole: "USER",
    status: "VERIFIED",
    authProvider: "LOCAL",
    isEmailVerified: true,
    isPhoneVerified: false,
    lastLoginAt: "2026-07-31T06:26:52.662Z",
    createdAt: "2026-07-30T23:36:42.130Z",
    settings: {
      theme: "light",
      language: "en",
      timezone: "Africa/Dar_es_Salaam",
      compactView: false,
      landingPage: "DASHBOARD",
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      dndEnabled: false,
      dndStartTime: "22:00",
      dndEndTime: "07:00",
      autoSave: true,
      academicChannels: ["DASHBOARD"],
      paymentChannels: ["DASHBOARD", "EMAIL"],
      systemChannels: ["DASHBOARD", "EMAIL"],
    },
    schools: [
      {
        schoolUId: "SCH-001",
        schoolId: "ESCH-260528001",
        name: "Feza Boys Secondary School",
        slug: "feza-boys",
        status: "ACTIVE",
        logo: null,
        displayName: "Feza Boys",
        roles: [
          { roleKey: "TEACHER", displayName: "Mwalimu wa Somo", priority: 1 }
        ],
        primaryRole: { roleKey: "TEACHER", displayName: "Mwalimu wa Somo", priority: 1 },
        designation: "Physics Teacher",
        staffNumber: "STF-2026-001",
      }
    ],
    cachedAt: "2026-07-31T06:27:10.371Z",
  },
  accountSecurity: {
    isComplianceMet: false,
    requiredActions: [
      {
        field: "phone",
        severity: "CRITICAL",
        action: "UPDATE_REQUIRED",
        message: "A valid phone number is required for Multi-Factor Authentication.",
      },
    ],
    alertLevel: "WARNING",
    recommendation: "Please complete the pending security actions to ensure uninterrupted access.",
  },
};

export const UserService = {
  async getUserProfile(): Promise<UserProfileResponse> {
    // Simulating network response time (300ms)
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_USER_PROFILE_DATA;
  },
};