'use client'
import Link from "next/link";

interface LinkProps {
    label: string;
    href: string;
    onClick?: () => void;
}

interface NavLinksProps {
    liClassName?: string;

    /**Nav links components ```[{ label:string, href: string, onClik?: () => void }]``` */
    links: LinkProps[];
    className?: string;

}

/**
 * Nav links
 * @param param0 links
 * @returns Nav links components ul based using next Link
 */
export const NavLinks = ({ className, liClassName, links } : NavLinksProps ) => {
    return(
        <ul className={`${className}`}>
            {links.map((link, i) => (
                <li key={i} className={`${liClassName}`} onClick={link.onClick}>
                    <Link href={link.href} className="decoration-none">{link.label}</Link>
                </li>
            ))}
        </ul>
    )
}