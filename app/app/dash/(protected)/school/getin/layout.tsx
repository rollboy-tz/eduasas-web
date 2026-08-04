import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prepare School Workspace",
  description: "Open a school workspace.",
};

export default function SwitchSchoolLayout(
    {
     children 
    } : { 
        children: React.ReactNode 
     }) {

    return (<>{children}</>)
}