import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getPlayers,
  getPlayersPath,
} from "../../../components/player/PageList";
import { PagedCollection } from "../../../types/collection";
import { Player } from "../../../types/Player";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getPlayersPath(page), getPlayers(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Player>>("/players");
  const paths = await getCollectionPaths(
    response,
    "players",
    "/players/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
