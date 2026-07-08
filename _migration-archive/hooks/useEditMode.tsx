import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Ctx = {
  enabled: boolean;
  toggle: () => void;
  setEnabled: (v: boolean) => void;
};

const EditModeContext = createContext<Ctx>({
  enabled: false,
  toggle: () => {},
  setEnabled: () => {},
});

const KEY = "lov_edit_mode";

export const EditModeProvider = ({ children }: { children: ReactNode }) => {
  const [enabled, setEnabledState] = useState(false);

  useEffect(() => {
    try {
      setEnabledState(localStorage.getItem(KEY) === "1");
    } catch {}
  }, []);

  const setEnabled = (v: boolean) => {
    setEnabledState(v);
    try { localStorage.setItem(KEY, v ? "1" : "0"); } catch {}
  };

  return (
    <EditModeContext.Provider value={{ enabled, toggle: () => setEnabled(!enabled), setEnabled }}>
      {children}
    </EditModeContext.Provider>
  );
};

export const useEditMode = () => useContext(EditModeContext);
