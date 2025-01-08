import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Score } from "../../types/Score";

interface Props {
  score?: Score;
}

interface SaveParams {
  values: Score;
}

interface DeleteParams {
  id: string;
}

const saveScore = async ({ values }: SaveParams) =>
  await fetch<Score>(!values["@id"] ? "/scores" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deleteScore = async (id: string) =>
  await fetch<Score>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ score }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Score> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveScore(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<Score> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteScore(id), {
    onSuccess: () => {
      router.push("/scores");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!score || !score["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: score["@id"] });
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/scores"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        {score ? `Edit Score ${score["@id"]}` : `Create Score`}
      </h1>
      <Formik
        initialValues={
          score
            ? {
                ...score,
              }
            : new Score()
        }
        validate={() => {
          const errors = {};
          // add your validation logic here
          return errors;
        }}
        onSubmit={(values, { setSubmitting, setStatus, setErrors }) => {
          const isCreation = !values["@id"];
          saveMutation.mutate(
            { values },
            {
              onSuccess: () => {
                setStatus({
                  isValid: true,
                  msg: `Element ${isCreation ? "created" : "updated"}.`,
                });
                router.push("/scores");
              },
              onError: (error) => {
                setStatus({
                  isValid: false,
                  msg: `${error.message}`,
                });
                if ("fields" in error) {
                  setErrors(error.fields);
                }
              },
              onSettled: () => {
                setSubmitting(false);
              },
            }
          );
        }}
      >
        {({
          values,
          status,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form className="shadow-md p-4" onSubmit={handleSubmit}>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="score_player_id"
              >
                player_id
              </label>
              <input
                name="player_id"
                id="score_player_id"
                value={values.player_id ?? ""}
                type="number"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.player_id && touched.player_id ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.player_id && touched.player_id ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="player_id"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="score_score"
              >
                score
              </label>
              <input
                name="score"
                id="score_score"
                value={values.score ?? ""}
                type="number"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.score && touched.score ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.score && touched.score ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="score"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="score_fk_plaxer_id"
              >
                fk_plaxer_id
              </label>
              <input
                name="fk_plaxer_id"
                id="score_fk_plaxer_id"
                value={values.fk_plaxer_id ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.fk_plaxer_id && touched.fk_plaxer_id
                    ? "border-red-500"
                    : ""
                }`}
                aria-invalid={
                  errors.fk_plaxer_id && touched.fk_plaxer_id
                    ? "true"
                    : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="fk_plaxer_id"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="score_playerId"
              >
                playerId
              </label>
              <input
                name="playerId"
                id="score_playerId"
                value={values.playerId ?? ""}
                type="number"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.playerId && touched.playerId ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.playerId && touched.playerId ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="playerId"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="score_fkPlaxerId"
              >
                fkPlaxerId
              </label>
              <input
                name="fkPlaxerId"
                id="score_fkPlaxerId"
                value={values.fkPlaxerId ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.fkPlaxerId && touched.fkPlaxerId
                    ? "border-red-500"
                    : ""
                }`}
                aria-invalid={
                  errors.fkPlaxerId && touched.fkPlaxerId ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="fkPlaxerId"
              />
            </div>
            {status && status.msg && (
              <div
                className={`border px-4 py-3 my-4 rounded ${
                  status.isValid
                    ? "text-cyan-700 border-cyan-500 bg-cyan-200/50"
                    : "text-red-700 border-red-400 bg-red-100"
                }`}
                role="alert"
              >
                {status.msg}
              </div>
            )}
            <button
              type="submit"
              className="inline-block mt-2 bg-cyan-500 hover:bg-cyan-700 text-sm text-white font-bold py-2 px-4 rounded"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </form>
        )}
      </Formik>
      <div className="flex space-x-2 mt-4 justify-end">
        {score && (
          <button
            className="inline-block mt-2 border-2 border-red-400 hover:border-red-700 hover:text-red-700 text-sm text-red-400 font-bold py-2 px-4 rounded"
            onClick={handleDelete}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
