import { createQuery, useQueryClient } from "@tanstack/solid-query";
import { Accessor, createEffect, on, useContext } from "solid-js";
import { getLowConfidenceQueries } from "../../api/analytics";
import { usePagination } from "../usePagination";
import { AnalyticsParams } from "shared/types";
import { DatasetContext } from "../../../contexts/DatasetContext";

const parseThreshold = (text: string): number | undefined => {
  const num = parseFloat(text);
  if (isNaN(num)) {
    return undefined;
  }
  return num;
};

export const useLowConfidenceQueries = ({
  thresholdText,
  params,
}: {
  thresholdText: Accessor<string>;
  params: AnalyticsParams;
}) => {
  const dataset = useContext(DatasetContext);

  const pages = usePagination();
  const queryClient = useQueryClient();
  createEffect(
    on(
      () => [params, dataset.datasetId(), thresholdText()],
      () => {
        pages.resetMaxPageDiscovered();
      },
    ),
  );

  createEffect(() => {
    // Preload the next page
    const datasetId = dataset.datasetId();
    const curPage = pages.page();
    void queryClient.prefetchQuery({
      queryKey: [
        "low-confidence-queries",
        {
          params: params,
          page: curPage + 1,
          threshold: parseThreshold(thresholdText()) || 0,
        },
      ],
      queryFn: async () => {
        const results = await getLowConfidenceQueries(
          params.filter,
          datasetId,
          curPage + 1,
          parseThreshold(thresholdText()),
        );
        if (results.length === 0) {
          pages.setMaxPageDiscovered(curPage);
        }
        return results;
      },
    });
  });

  const lowConfidenceQueriesQuery = createQuery(() => ({
    queryKey: [
      "low-confidence-queries",
      {
        params: params,
        page: pages.page(),
        threshold: parseThreshold(thresholdText()) || 0,
      },
    ],
    queryFn: () => {
      return getLowConfidenceQueries(
        params.filter,
        dataset.datasetId(),
        pages.page(),
        parseThreshold(thresholdText()),
      );
    },
  }));

  return {
    pages,
    lowConfidenceQueriesQuery,
  };
};
