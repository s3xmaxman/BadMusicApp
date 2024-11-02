import React from "react";

interface Props {
  params: {
    tag: string;
  };
}

const page = async ({ params: { tag } }: Props) => {
  return <div>page</div>;
};

export default page;
