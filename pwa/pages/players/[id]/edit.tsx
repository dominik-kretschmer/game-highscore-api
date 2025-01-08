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

import { Form } from "../../../components/player/Form";
import { PagedCollection } from "../../../types/collection";
import { Player } from "../../../types/Player";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";

const getPlayer = async (id: string | string[] | undefined) =>
  id ? await fetch<Player>(`/players/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: player } = {} } = useQuery<
    FetchResponse<Player> | undefined
  >(["player", id], () => getPlayer(id));

  if (!player) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{player && `Edit Player ${player["@id"]}`}</title>
        </Head>
      </div>
      <Form player={player} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["player", id], () => getPlayer(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Player>>("/players");
  const paths = await getItemPaths(response, "players", "/players/[id]/edit");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
