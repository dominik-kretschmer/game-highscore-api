import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Player } from "../../types/Player";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getPlayersPath = (page?: string | string[] | undefined) =>
  `/players${typeof page === "string" ? `?page=${page}` : ""}`;
export const getPlayers = (page?: string | string[] | undefined) => async () =>
  await fetch<PagedCollection<Player>>(getPlayersPath(page));
const getPagePath = (path: string) =>
  `/players/page/${parsePage("players", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: players, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Player>> | undefined
  >(getPlayersPath(page), getPlayers(page));
  const collection = useMercure(players, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Player List</title>
        </Head>
      </div>
      <List players={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
