export const TopBar = ({ children }: { children: React.ReactNode }) => {
  return (
    <header className="sticky top-0 z-[40] w-full h-12 border-b border-border flex items-center justify-between px-3">
      {/* Hapa ndipo maudhui yako kutoka nje yatajitokeza */}
      
      {children}
    </header>
  );
};