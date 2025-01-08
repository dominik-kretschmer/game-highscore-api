import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/player/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Player</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
