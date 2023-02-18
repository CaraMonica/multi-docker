import { useCallback, useEffect, useState } from "react";
import axios from "axios";

const useAxiosFetch = (url, defaultData) => {
  const [data, setData] = useState(defaultData);
  const [loaded, setLoaded] = useState(false);

  const doFetch = useCallback(
    () =>
      axios
        .get(url)
        .then((response) => setData(response.data))
        .catch((error) => console.log(error.message))
        .finally(() => setLoaded(true)),
    []
  );

  useEffect(() => {
    doFetch();
  }, [doFetch]);

  return { data, loaded, reFetch: doFetch };
};

export const useCalculatedValues = () =>
  useAxiosFetch("/api/values/current", {});

export const useSeenIndices = () => useAxiosFetch("/api/values/all", []);
