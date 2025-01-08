import {
  GetStaticPaths,
  GetStaticProps,
  NextComponentType,
  NextPageContext,
} from "next";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from "react-query";

import { Form } from "../../../components/score/Form";
import { PagedCollection } from "../../../types/collection";
import { Score } from "../../../types/Score";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";

const getScore = async (id: string | string[] | undefined) =>
  id ? await fetch<Score>(`/scores/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: score } = {} } = useQuery<
    FetchResponse<Score> | undefined
  >(["score", id], () => getScore(id));

  if (!score) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{score && `Edit Score ${score["@id"]}`}</title>
        </Head>
      </div>
      <Form score={score} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["score", id], () => getScore(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Score>>("/scores");
  const paths = await getItemPaths(response, "scores", "/scores/[id]/edit");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
