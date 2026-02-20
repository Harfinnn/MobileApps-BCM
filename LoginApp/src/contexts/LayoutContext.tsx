import React, { createContext, useContext, useState, useMemo } from 'react';

type LayoutContextType = {
  hideNavbar: boolean;
  setHideNavbar: (v: boolean) => void;

  title: string;
  setTitle: (title: string) => void;

  showBack: boolean;
  setShowBack: (v: boolean) => void;

  showSearch: boolean;
  setShowSearch: (v: boolean) => void;

  hideHeaderLeft: boolean;
  setHideHeaderLeft: (v: boolean) => void;

  onBack?: () => void;
  setOnBack: (fn?: () => void) => void;

  headerBg: string;
  setHeaderBg: (v: string) => void;

  resetLayout: () => void;
};

const LayoutContext = createContext<LayoutContextType>({
  hideNavbar: false,
  setHideNavbar: () => {},

  title: 'Home',
  setTitle: () => {},

  showBack: false,
  setShowBack: () => {},

  showSearch: true,
  setShowSearch: () => {},

  hideHeaderLeft: false,
  setHideHeaderLeft: () => {},

  onBack: undefined,
  setOnBack: () => {},

  headerBg: 'transparent',
  setHeaderBg: () => {},

  resetLayout: () => {},
});

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [hideNavbar, setHideNavbar] = useState(false);
  const [title, setTitle] = useState('Home');
  const [showSearch, setShowSearch] = useState(true);
  const [showBack, setShowBack] = useState(false);
  const [onBack, setOnBack] = useState<(() => void) | undefined>();
  const [headerBg, setHeaderBg] = useState('transparent');
  const [hideHeaderLeft, setHideHeaderLeft] = useState(false);

  const resetLayout = () => {
    setHideNavbar(false);
    setTitle('Home');
    setShowBack(false);
    setOnBack(undefined);
    setHeaderBg('transparent');
  };

  const value = useMemo(
    () => ({
      hideNavbar,
      setHideNavbar,
      title,
      setTitle,
      showBack,
      setShowBack,
      onBack,
      setOnBack,
      headerBg,
      setHeaderBg,
      resetLayout,
      showSearch,
      setShowSearch,
      hideHeaderLeft,
      setHideHeaderLeft
    }),
    [hideNavbar, title, showBack, onBack, headerBg, showSearch, hideHeaderLeft],
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};

export const useLayout = () => useContext(LayoutContext);
