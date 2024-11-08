import { getCurrentUser } from "@/lib/appwrite";
import { createContext, useContext, useEffect, useState } from "react";
import { Models } from "react-native-appwrite";


interface GlobalContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  user: Models.Document | null;
  setUser: React.Dispatch<React.SetStateAction<Models.Document | null>>;
}

const GlobalContext = createContext<GlobalContextType | null>(null);

export const useGlobalContext = () => {
  const globalUserContext = useContext(GlobalContext);

  if (!globalUserContext) {
    throw new Error(
      "useGlobalContext has to be used with <GlobalContext.Provider>"
    );
  }
  return globalUserContext;
};

type GlobalProviderProps = {
  children: React.ReactNode;
};

const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null as Models.Document | null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLoggedIn(true);
          setUser(res);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
