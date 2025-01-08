import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getScores,
  getScoresPath,
} from "../../../components/score/PageList";
import { PagedCollection } from "../../../types/collection";
import { Score } from "../../../types/Score";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getScoresPath(page), getScores(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Score>>("/scores");
  const paths = await getCollectionPaths(
    response,
    "scores",
    "/scores/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
