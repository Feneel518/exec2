import { SignIn } from "@clerk/nextjs";
import { FC } from "react";

interface PageProps {}

const Page: FC<PageProps> = ({}) => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <SignIn></SignIn>
    </div>
  );
};

export default Page;
