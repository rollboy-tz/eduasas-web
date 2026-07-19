'use client'
import { NavLinks } from "@/components/ui/nav-links"

const LandingPage = () => {

    const links = [
        { label: "Docs", href: "/docs" },
        { label: "Contacts", href: "/contacts" }
    ]


    return(
        <main className="h-screen w-full flex flex-col bg-primary-50">
            <header className="w-full backdrop-blur-sm flex justify-between items-center py-2 px-1">
                <h3>Logo</h3>
                <nav>
                    <NavLinks
                        links={links}
                        className="flex items-center gap-5"
                        liClassName="font-medium text-primary-900 hover:text-primary-600 transition-all duration-200"
                    />
                </nav>
                <button className="border border-primary-600 text-primary-600 text-center font-medium px-3 py-1 rounded-full bg-primary-50 hover:bg-primary-600 hover:text-primary-50 transition-all duration-300 cursor-pointer">
                    Get Started
                </button>
            </header>
        </main>
    )
}

export default LandingPage