"use client";

import React from "react";
import PhoneInputLib, { PhoneInputProps } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Label } from "./label";

// Tunapanua Interface ili ikubali sifa za List na Hover
interface CustomPhoneProps extends PhoneInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
  // Props za Maandishi na List
  listBg?: string;           
  listTextColor?: string;    
  listPadding?: string;      
  listFontSize?: string;     
  // Props za Hover
  listHoverBg?: string;          
  listHoverTextColor?: string;   
  // Props za Dial Code (+255)
  dialCodeColor?: string;    
}

export const EduPhoneField = ({
  label,
  error,
  containerClassName,
  // Maadili ya Default (EduAsas Style / Shadcn Mapping)
  listBg = "var(--card-bg)",
  listTextColor = "var(--text-main)",
  listPadding = "10px 12px",
  listFontSize = "13px",
  listHoverBg = "var(--primary)",
  listHoverTextColor = "#ffffff",
  dialCodeColor = "var(--icon-muted)",
  onChange, // Tunapokea onChange kutoka nje
  ...props
}: CustomPhoneProps) => {
  
  const instanceId = React.useId().replace(/:/g, "");
  const customClass = `edu-phone-${instanceId}`;

  // SMART VALIDATION LOGIC (UI/UX)
  const handlePhoneChange = (value: string, data: any, event: React.ChangeEvent<HTMLInputElement>, formattedValue: string) => {
    let updatedValue = value;
    const countryCode = data.dialCode; // Mfano: "255"
    
    // Tunapata namba bila country code
    // Mfano kama value ni "2550", localNumber itakuwa "0"
    const localNumber = value.startsWith(countryCode) 
      ? value.slice(countryCode.length) 
      : value;

    // UX TRICK:
    // Kama mtumiaji ameandika "0" pekee, tunaiacha ili asihisi keyboard imegoma.
    // Lakini akiongeza namba nyingine baada ya hiyo 0 (mfano "07"), tunaitoa ile 0.
    if (localNumber.length > 1 && localNumber.startsWith("0")) {
      const correctedLocal = localNumber.slice(1);
      updatedValue = countryCode + correctedLocal;
    }

    // Tunarudisha thamani kwenye onChange ya asili iliyopitishwa
    if (onChange) {
      onChange(updatedValue, data, event, formattedValue);
    }
  };

  return (
    <div className={`space-y-1.5 w-full ${containerClassName}`}>
      <style>{`
        /* 1. SHADCN DEFAULT INPUT STYLE & FOCUS (The Ring) */
        .${customClass}.eduasas-phone-wrapper .form-control {
          background: var(--input-bg) !important;
          color: var(--input-text) !important;
          border: 1px solid var(--input-border) !important;
          border-radius: 0 var(--radius-md) var(--radius-md) 0 !important;
          transition: border .2s ease, background .2s ease, box-shadow .2s ease !important;
        }

        .${customClass}.eduasas-phone-wrapper .form-control:focus {
          outline: none !important;
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 2px var(--body), 0 0 0 4px rgba(0, 51, 255, 0.15) !important;
        }

        /* 2. BOX KUU LA LIST (Dropdown Container) */
        .${customClass}.eduasas-phone-wrapper .country-list {
          background-color: ${listBg} !important;
          border: 1px solid var(--border) !important;
          border-radius: var(--radius-md) !important;
          padding: 5px !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
          margin-top: 8px !important;
          z-index: 100 !important;
        }

        /* 3. MUONEKANO WA KILA NCHI (Individual List Item) */
        .${customClass}.eduasas-phone-wrapper .country-list .country {
          padding: ${listPadding} !important;
          color: ${listTextColor} !important;
          font-size: ${listFontSize} !important;
          transition: all 0.2s ease !important;
          border-radius: calc(var(--radius-md) - 2px) !important;
          display: flex;
          align-items: center;
        }

        /* 4. HOVER EFFECT */
        .${customClass}.eduasas-phone-wrapper .country-list .country:hover {
          background-color: ${listHoverBg} !important;
          color: ${listHoverTextColor} !important;
        }

        /* 5. DIAL CODE STYLE (+255) */
        .${customClass}.eduasas-phone-wrapper .country-list .dial-code {
          color: ${dialCodeColor} !important;
          margin-left: auto !important;
          font-weight: 600 !important;
        }

        .${customClass}.eduasas-phone-wrapper .country-list .country:hover .dial-code {
          color: ${listHoverTextColor} !important;
          opacity: 0.9;
        }

        /* 6. HIGHLIGHTED */
        .${customClass}.eduasas-phone-wrapper .country-list .country.highlight {
          background-color: var(--info-primary-bg) !important;
          color: var(--primary) !important;
        }

        /* FLAG DROPDOWN BUTTON STYLE */
        .${customClass}.eduasas-phone-wrapper .flag-dropdown {
          background: var(--body) !important;
          border: 1px solid var(--input-border) !important;
          border-radius: var(--radius-md) 0 0 var(--radius-md) !important;
        }
      `}</style>

      {label && (
        <Label className="text-[12px] font-bold text-[var(--icon-color)] ml-0.5 uppercase tracking-wide">
          {label}
        </Label>
      )}

      <div className={`${customClass} eduasas-phone-wrapper relative`}>
        <PhoneInputLib
          country={"tz"}
          countryCodeEditable={false}
          onChange={handlePhoneChange} // Tunatumia function yetu ya ujanja
          inputClass={`!w-full !h-11 !text-[14px] !font-medium !border !transition-all
            ${error 
              ? "!border-[var(--error-border)] !bg-[var(--error-bg)]" 
              : "!border-[var(--input-border)] !bg-[var(--input-bg)]"
            }`}
          inputStyle={{
            borderRadius: "0 var(--radius) var(--radius) 0",
            borderLeft: "none",
            fontSize: "14px",
            ...props.inputStyle
          }}
          buttonStyle={{
            borderRadius: "var(--radius-md) 0 0 var(--radius-md)",
            borderColor: error ? "var(--error-border)" : "var(--input-border)",
            backgroundColor: "var(--body)",
            ...props.buttonStyle
          }}
          {...props}
        />
      </div>

      {error && (
        <p className="text-[10px] text-destructive font-black uppercase italic ml-0.5 mt-1">
          {error}
        </p>
      )}
    </div>
  );
};