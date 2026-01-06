import React, { createContext, useContext, useState } from 'react';

type LayoutContextType = {
  hideNavbar: boolean;
  setHideNavbar: (v: boolean) => void;

  title: string;
  setTitle: (title: string) => void;

  showBack: boolean;
  setShowBack: (v: boolean) => void;

  onBack?: () => void;
  setOnBack: (fn?: () => void) => void;
};

const LayoutContext = createContext<LayoutContextType>({
  hideNavbar: false,
  setHideNavbar: () => {},

  title: 'Home',
  setTitle: () => {},

  showBack: false,
  setShowBack: () => {},

  onBack: undefined,
  setOnBack: () => {},
});

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [hideNavbar, setHideNavbar] = useState(false);
  const [title, setTitle] = React.useState('Home');
  const [showBack, setShowBack] = useState(false);
  const [onBack, setOnBack] = useState<(() => void) | undefined>();

  return (
    <LayoutContext.Provider
      value={{
        hideNavbar,
        setHideNavbar,
        title,
        setTitle,
        showBack,
        setShowBack,
        onBack,
        setOnBack,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => useContext(LayoutContext);
