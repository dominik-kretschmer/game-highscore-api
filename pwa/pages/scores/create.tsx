import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/score/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Score</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
