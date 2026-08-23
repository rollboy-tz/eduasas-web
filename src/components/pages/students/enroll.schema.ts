// path: src/components/students/schemas/enroll.schema.ts

import { z } from "zod";

/**
 * ENROLL SCHEMA
 * Comprehensive validation for Profile, Academic, and Guardian data
 */
export const enrollSchema = z.object({
  // 1. PROFILE DATA [2026-02-05 Updates]
  profile: z.object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name is too short")
      .max(50),
    middleName: z
      .string()
      .trim()
      .max(50)
      .optional()
      .nullable(),
    lastName: z
      .string()
      .trim()
      .min(2, "Last name is too short")
      .max(50),
    gender: z.enum(["MALE", "FEMALE"], {
      message: "Gender must be either MALE or FEMALE",
    }),
    dateOfBirth: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in valid YYYY-MM-DD format"),
    photoUrl: z
      .string()
      .url("Invalid photo URL format")
      .optional()
      .nullable(),
  }),

  // 2. ACADEMIC DATA (Tanzania Standards & Stream Awareness)
  academic: z.object({
    admissionNo: z
      .string()
      .trim()
      .min(2, "Admission number is required"),
    sectionId: z
      .string()
      .min(26, "Invalid Section ID (ULID)")
      .max(27, "Invalid Section ID length"),
    
    // Stream ID iwe optional kwa ajili ya fallback logic ya GENERAL stream
    streamId: z
      .string()
      .min(26, "Invalid Stream ID")
      .max(27)
      .optional()
      .nullable(),
    
    entryYear: z
      .union([z.string(), z.number()])
      .transform((v) => Number(v)),
    
    premsNumber: z
      .string()
      .trim()
      .max(30)
      .optional()
      .nullable(),
    bemisNumber: z
      .string()
      .trim()
      .max(30)
      .optional()
      .nullable(),
    indexNo: z
      .string()
      .trim()
      .max(30)
      .optional()
      .nullable(),
  }),

  // 3. GUARDIAN DATA [2026-02-05 Parent Email & Address]
  guardian: z
    .object({
      fullName: z
        .string()
        .trim()
        .min(3, "Full name of guardian is required"),
      phone: z
        .string()
        .trim()
        .min(10, "Valid phone number is required")
        .max(15),
      email: z
        .string()
        .email("Invalid parent email address")
        .optional()
        .nullable(),
      homeAddress: z
        .string()
        .trim()
        .min(3, "Parent home address is required")
        .optional()
        .nullable(),
      relationship: z
        .string()
        .trim()
        .default("PARENT"),
    })
    .optional()
    .nullable(),
});