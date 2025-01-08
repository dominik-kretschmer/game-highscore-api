import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Score } from "../../types/Score";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getScoresPath = (page?: string | string[] | undefined) =>
  `/scores${typeof page === "string" ? `?page=${page}` : ""}`;
export const getScores = (page?: string | string[] | undefined) => async () =>
  await fetch<PagedCollection<Score>>(getScoresPath(page));
const getPagePath = (path: string) =>
  `/scores/page/${parsePage("scores", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: scores, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Score>> | undefined
  >(getScoresPath(page), getScores(page));
  const collection = useMercure(scores, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Score List</title>
        </Head>
      </div>
      <List scores={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
