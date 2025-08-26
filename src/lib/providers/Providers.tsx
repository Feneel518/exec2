import { ClerkProvider } from "@clerk/nextjs";
import { FC } from "react";

interface ProvidersProps {
  children?: React.ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  return <ClerkProvider>{children}</ClerkProvider>;
};

export default Providers;
