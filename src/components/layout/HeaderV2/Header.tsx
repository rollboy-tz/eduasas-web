// path: src/components/layout/HeaverV2/Header.tsx

'use client';

import { LeftHeaderContents } from "./LeftHeaderContents";
import { RightHeaderContents } from "./RightHeaderContents";

export const Header = () => {
    return(
        <div className="w-full flex items-center justify-between py-2">
            {/* Sehemu ya Kushoto: Mobile Menu Button & Dynamic Title */}
            <LeftHeaderContents />

            {/* Sehemu ya Kulia: Search, Badges, na Profile Panel */}
            <RightHeaderContents />
        </div>
    );
};