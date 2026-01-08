import React, {
  createContext,
  useContext,
  useState,
} from 'react';

type LayoutContextType = {
  hideNavbar: boolean;
  setHideNavbar: (v: boolean) => void;

  title: string;
  setTitle: (title: string) => void;

  showBack: boolean;
  setShowBack: (v: boolean) => void;

  onBack?: () => void;
  setOnBack: (fn?: () => void) => void;

  headerBg: string;                 
  setHeaderBg: (v: string) => void; 

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

  headerBg: '#00A39D',
  setHeaderBg: () => {}, 

});

export const LayoutProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [hideNavbar, setHideNavbar] = useState(false);
  const [title, setTitle] = useState('Home');
  const [showBack, setShowBack] = useState(false);
  const [onBack, setOnBack] = useState<(() => void) | undefined>();
  const [headerBg, setHeaderBg] = useState('#00A39D');

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
        headerBg,
        setHeaderBg,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => useContext(LayoutContext);