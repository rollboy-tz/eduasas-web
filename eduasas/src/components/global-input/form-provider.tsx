"use client";

import { createContext, useContext, useState } from "react";
import { Schema, validateField } from "./schema";

type FormContextType = {
  values: Record<string, string>;
  errors: Record<string, string | null>;
  setValue: (name: string, value: string) => void;
  validate: (name: string) => void;
  schema?: Schema;
};

const FormContext = createContext<FormContextType | null>(null);

export function FormProvider({
  children,
  schema,
}: {
  children: React.ReactNode;
  schema?: Schema;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>(
    {}
  );

  const setValue = (name: string, value: string) => {
    setValues((p) => ({ ...p, [name]: value }));
  };

  const validate = (name: string) => {
    const error = validateField(
      name,
      values[name] || "",
      schema || {},
      values
    );

    setErrors((p) => ({ ...p, [name]: error }));
  };

  return (
    <FormContext.Provider
      value={{ values, errors, setValue, validate, schema }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("FormProvider missing");
  return ctx;
}