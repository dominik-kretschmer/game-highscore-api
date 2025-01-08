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

import { Show } from "../../../components/score/Show";
import { PagedCollection } from "../../../types/collection";
import { Score } from "../../../types/Score";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getScore = async (id: string | string[] | undefined) =>
  id ? await fetch<Score>(`/scores/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: score, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<Score> | undefined>(["score", id], () =>
      getScore(id)
    );
  const scoreData = useMercure(score, hubURL);

  if (!scoreData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Score ${scoreData["@id"]}`}</title>
        </Head>
      </div>
      <Show score={scoreData} text={text} />
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
  const paths = await getItemPaths(response, "scores", "/scores/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
