import { useState, useEffect, useCallback, useRef } from "react";
import axios, { AxiosRequestConfig, AxiosResponse, Canceler } from 'axios';
axios.defaults.withCredentials = true;

export enum FetchType {
  GET = 'get',
  POST = 'post',
  PUT = 'put'
}

function constructRequest(uri: string, type: FetchType, options?: AxiosRequestConfig, body?: any): Promise<AxiosResponse<any>> {
  switch (type) {
    case FetchType.GET:
      return axios.get(uri, options)
    case FetchType.POST:
      return axios.post(uri, body, options)
    case FetchType.PUT:
      return axios.put(uri, body, options)
    default:
      throw new Error('');
  }
}

/**
 *
 *
 * @param {string} uri
 * @param {FetchType} [type=FetchType.GET]
 * @param {AxiosRequestConfig} [options]
 * @returns {([T, boolean, string | null, (body: any) => void, () => void])}
 */
function useFetchData<T>(
  uri: string,
  type: FetchType = FetchType.GET,
  options: AxiosRequestConfig = {},
): [T | null, boolean, string | null, (body: any) => Promise<any>, () => void] {

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const cancelToken = useRef<Canceler | null>(null);

  const next = useCallback(_next, [uri, type, options]);

  useEffect(() => {
    if (type === FetchType.GET) {
      console.log('initial request')
      next({}).catch(() => { });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function cancel() {
    if (cancelToken.current) {
      cancelToken.current();
    }
  }

  function _next(body: any) {
    if (cancelToken.current) {
      cancel();
    }

    setLoading(true);
    const _options = Object.assign({}, options, { cancelToken: new axios.CancelToken(token => cancelToken.current = token) });
    return constructRequest(uri, type, _options, body)
      .then(res => {
        setLoading(false);
        setErrorMessage(null);
        setData(res.data);
        return res;
      })
      .catch(err => {
        setLoading(false);
        setErrorMessage(err.response?.data ? err.response.data.message : 'Something went wrong.')
        throw err;
      });
  }

  return [data, isLoading, errorMessage, next, cancel];
}

export default useFetchData;