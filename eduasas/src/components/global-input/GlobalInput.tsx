// "use client";

// import {  useState, useRef } from "react";

// import { GlobalInputProps } from "./types";
// import { useDebounce } from "./useDebounce";
// import { useEmailSuggestions } from "./useEmailSuggestions";
// import { autoIcons } from "./utils";
// import { useAsyncValidation } from "./useAsyncValidation";
// import { AlertCircle } from "lucide-react";

// /**
//  * GLOBAL INPUT v2
//  *
//  * FEATURES:
//  * - Floating / inside / top label
//  * - Email suggestions (TAB + mobile tap)
//  * - Async validation support
//  * - Password + confirm password
//  * - Lucide icons auto mapping
//  */

// export default function GlobalInput({
//   value,
//   onChange,
//   type = "text",
//   label,
//   placeholder,
//   labelMode = "top",
//   leftIcon,
//   rightIcon,
//   autoIcon = true,
//   error,
//   errorMessage,
//   helperText,
//   parentPassword,
//   asyncValidator,
//   fullWidth = true,
// }: GlobalInputProps) {

//   const [focused, setFocused] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const inputRef = useRef<HTMLInputElement>(null);

//   const debounced = useDebounce(value, 400);

//   const Icon = autoIcons[type as string] ?? null;

//   /**
//    * EMAIL SUGGESTIONS ENGINE
//    */
//   const suggestions = useEmailSuggestions(value);

//   /**
//    * ASYNC VALIDATION
//    */
//   const { error: asyncError, loading } =
//     useAsyncValidation(debounced, asyncValidator);

//   /**
//    * PASSWORD TYPE HANDLER
//    */
//   const inputType =
//     type === "password" || type === "confirm-password"
//       ? showPassword
//         ? "text"
//         : "password"
//       : "text";

//   /**
//    * CONFIRM PASSWORD CHECK
//    */
//   const matchError =
//     type === "confirm-password" &&
//     parentPassword !== undefined &&
//     value !== parentPassword;

//   const finalError = error || asyncError || matchError;

//   /**
//    * TAB AUTOFILL EMAIL SUGGESTION
//    */
//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === "Tab" && suggestions.length > 0) {
//       e.preventDefault();
//       onChange(suggestions[0]);
//     }
//   };

//   return (
//     <div className={`${fullWidth ? "w-full" : ""} space-y-1`}>

//       {/* LABEL */}
//       {label && labelMode === "top" && (
//         <label className="text-sm font-medium">
//           {typeof label === "function"
//             ? label({ value, focused })
//             : label}
//         </label>
//       )}

//       {/* INPUT WRAPPER */}
//       <div className="relative flex items-center border rounded-lg px-3 py-2">

//         {/* LEFT ICON */}
//         {(leftIcon || Icon) && (
//           <span className="mr-2 text-gray-500">
//             {leftIcon || (Icon && <Icon size={18} />)}
//           </span>
//         )}

//         {/* INPUT */}
//         <input
//           ref={inputRef}
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           onFocus={() => setFocused(true)}
//           onBlur={() => setFocused(false)}
//           onKeyDown={handleKeyDown}
//           type={inputType}
//           placeholder={placeholder}
//           className="w-full outline-none bg-transparent"
//         />

//         {/* PASSWORD TOGGLE */}
//         {(type === "password" || type === "confirm-password") && (
//           <button
//             type="button"
//             onClick={() => setShowPassword((p) => !p)}
//             className="text-sm text-gray-500"
//           >
//             {showPassword ? "Hide" : "Show"}
//           </button>
//         )}
//       </div>

//       {/* EMAIL SUGGESTIONS (CLICK / TAP) */}
//       {type === "email" && suggestions.length > 0 && (
//         <div className="flex flex-wrap gap-2">
//           {suggestions.map((s) => (
//             <button
//               key={s}
//               type="button"
//               onClick={() => onChange(s)}
//               className="text-xs bg-gray-100 px-2 py-1 rounded"
//             >
//               {s}
//             </button>
//           ))}
//         </div>
//       )}

//       {/* ERROR */}
//       {finalError && (
//         <p className="text-red-500 text-xs flex items-center gap-1">
//           <AlertCircle size={14} />
//           {errorMessage || "Invalid input"}
//         </p>
//       )}

//       {/* LOADING STATE */}
//       {loading && (
//         <p className="text-xs text-gray-400">Checking...</p>
//       )}

//       {/* HELPER */}
//       {!finalError && helperText && (
//         <p className="text-xs text-gray-400">{helperText}</p>
//       )}
//     </div>
//   );
// }