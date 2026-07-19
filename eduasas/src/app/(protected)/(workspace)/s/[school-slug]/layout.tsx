'use client';

import { useEffect, useMemo } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { EduMainLoader } from '@/components/elements';
import { Sidebar, TopBar, SidebarComposer, ProfilePanel, GlobalSearch, TopBarLeft, TopBarRight, TopBarBreadcrumbs, SidebarFooter, SidebarWrapper, SidebarHeader } from '@/components/layout';
import { SchoolProvider, useSchoolContext } from '@/providers/school-context-provider';
import { useSidebarStore, useAppStore } from '@/store/layout';
import { useSchoolData } from '@/providers/context-provider';
import { motion } from 'framer-motion';
import { useMenuData } from '@/hooks/layout';
import { useUser } from '@/hooks/users';

/**
 * ### SchoolLayoutContent
 * Hapa ndipo tunapokagua "Passport" ya mtumiaji (URL Slug vs Server Context).
 * Hii component inaishi ndani ya SchoolProvider, hivyo inaweza kutumia `useSchoolContext()`
 * bila hofu ya kupata "Provider Error".
 */
function SchoolLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  // Stores
  const isMobileView = useAppStore((state) => state.isMobileView);
  const mode = useSidebarStore((state) => state.mode);
  

  // Context & Hooks
  const { schools, isLoading: isUserLoading } = useUser();
  const { school: contextSchool, isReady: isContextReady, status: contextStatus } = useSchoolContext();
  const { data: tenant } = useSchoolData();
  const { menuGroups } = useMenuData("school", tenant?.school.slug);

  const slug = params["school-slug"] as string;

  // --- GATE LOGIC (Verification Matrix) ---
  const validation = useMemo(() => {
    // 1. Kama bado loading ya kwanza inaendelea, baki kwenye Loader
    if (isUserLoading || contextStatus === 'loading') {
      return { state: 'LOADING' };
    }

    // 2. SWR ikisafishwa, 'schools' inakuwa undefined au tupu.
    // Badala ya kukimbilia INVALID_SCHOOL, baki kwenye LOADING kusubiri revalidation imalize.
    if (!schools || schools.length === 0) {
      return { state: 'LOADING' };
    }

    // 3. Tafuta shule kwenye orodha iliyorudi
    const schoolInList = schools.find((s) => s.slug === slug);
    
    // 🚨 KAMA HAIPO: Angalia kama ni kweli haipo au ni SWR inajisawazisha.
    // Kama mtumiaji ana shule zingine kwenye list lakini hii slug haipo kabisa, 
    // na context bado haijakaa sawa, mpe faida ya mashaka (LOADING) badala ya kumfukuza.
    if (!schoolInList) {
      if (!contextSchool || contextSchool.slug !== slug) {
        return { state: 'LOADING' }; // Subiri background sync au revalidation imalize
      }
      return { state: 'INVALID_SCHOOL' };
    }

    // 4. Ukaguzi wa Server Context
    const isSynced = contextSchool?.slug === slug;
    if (!isSynced) {
      return { state: 'UNSYNCED', school: schoolInList };
    }

    return { state: 'AUTHORIZED', school: schoolInList };
  }, [isUserLoading, contextStatus, schools, slug, contextSchool]);

  // --- EFFECT: HANDLING REDIRECTS & SIGNALS ---
  useEffect(() => {
    if (validation.state === 'INVALID_SCHOOL') {
      router.replace('/u/home');
      return;
    }

    if (validation.state === 'UNSYNCED') {
      // Sasa tuna uhakika 'validation.school' ipo kwa sababu tumerudisha kutoka kwenye useMemo
      const targetSchool = (validation as any).school;

      console.log(`Triggering background sync for: ${slug}`);

      window.dispatchEvent(
        new CustomEvent('app:sync-context', {
          detail: {
            slug: slug,
            schoolId: targetSchool?.schoolId || ''
          }
        })
      );
    }
  }, [validation, router, slug]);

  // --- LAYOUT PADDING LOGIC ---
  const dynamicPadding = useMemo(() => {
    if (isMobileView || mode === "hidden") return 0;
    if (mode === "minimal") return 50;
    if (mode === "expanded") return 220;
    return 50;
  }, [isMobileView, mode]);

  // --- EARLY RETURNS (The Security Guards) ---
  // Hapa tunazuia "Unauthorized Rendering" ya vitu vya ndani
  if (validation.state === 'LOADING' || validation.state === 'UNSYNCED') {
    return (
      <div className="h-screen w-full min-h-full max-h-screen flex items-center justify-center bg-background">
        <EduMainLoader size={30} />
      </div>
    );
  }

  // Hard stop for fake URLs
  if (validation.state === 'INVALID_SCHOOL') return null;

  // --- AUTHORIZED RENDER ---
  return (
    // 1. OUTER WRAPPER: Inazuia page nzima ku-scroll (Viewport Lock)
    <div className="h-screen w-full bg-background overflow-hidden flex relative select-none">

      {/* 2. SIDEBAR: Iko fixed kitalamu upande wa kushoto ikiwa na sub-components zake */}
      <Sidebar>
        {/* Header: Iko juu ya sidebar, haitembei */}
        <SidebarHeader isOpen={mode === "expanded" || mode === "mobile"} />

        {/* Wrapper inashughulika na mambo ya ku-scroll orodha ya menu TU */}
        <SidebarWrapper>
          <SidebarComposer menuData={menuGroups} currentPath={pathname} />
        </SidebarWrapper>

        {/* Footer: Iko chini kabisa ya sidebar, haitembei */}
        <SidebarFooter isOpen={mode === "expanded"} />
      </Sidebar>

      {/* 3. CONTENT AREA: Inachukua skrini iliyobaki */}
      <motion.div
        initial={false}
        animate={{ paddingLeft: dynamicPadding }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="h-full w-full flex flex-col relative overflow-hidden"
      >

        {/* 4. TOPBAR: Tunaiweka flex-shrink-0 na kuifunga ndani ya kuta za Acrylic Blur */}
        <div className="flex-shrink-0 z-40 bg-background/80 backdrop-blur-md">
          <TopBar>
            <TopBarLeft>
              <TopBarBreadcrumbs />
            </TopBarLeft>
            <TopBarRight />
          </TopBar>
        </div>

        {/* 5. SCROLLABLE AREA: Hili ndio eneo pekee ndani ya mfumo linaloruhusiwa ku-scroll data */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-secondary/[0.02] relative">
          <div className="max-w-[1600px] max-h-screen mx-auto min-h-full bg-inherit">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-inherit"
            >
              {children}
            </motion.div>
          </div>

          {/* Vifaa vya ziada vya msaada vya kimataifa */}
          <ProfilePanel />
          <GlobalSearch />
        </main>

      </motion.div>
    </div>
  );
}

/**
 * ### SchoolLayout (The Wrapper)
 * Hii ndiyo entry point. Inafunga kila kitu kwenye SchoolProvider 
 * ili SchoolLayoutContent ipate muktadha.
 */
export default function SchoolLayout({ children }: { children: React.ReactNode }) {
  return (
    <SchoolProvider>
      <SchoolLayoutContent>{children}</SchoolLayoutContent>
    </SchoolProvider>
  );
}