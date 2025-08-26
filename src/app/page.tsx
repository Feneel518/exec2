import Link from "next/link";
import { FC } from "react";

interface PageProps {}

const Page: FC<PageProps> = ({}) => {
  return (
    <div>
      <Link href={"/dashboard"}>Go to Dashboard</Link>
    </div>
  );
};

export default Page;
