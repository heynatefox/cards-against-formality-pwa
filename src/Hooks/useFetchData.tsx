import { useState, useEffect, useCallback, useRef, useContext } from "react";
import axios, { AxiosRequestConfig, AxiosResponse, Canceler } from 'axios';

import { RouterContext } from '../Contexts/RouteProvider';
import { UserContext } from "../Contexts/UserProvider";

axios.defaults.withCredentials = true;

export enum FetchType {
  GET = 'get',
  POST = 'post',
  PUT = 'put'
}

function constructRequest(uri: string, type: FetchType, options: AxiosRequestConfig, body?: any): Promise<AxiosResponse<any>> {
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
  const { token } = useContext(UserContext);
  const { history } = useContext(RouterContext);
  const historyRef = useRef(history);

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const cancelToken = useRef<Canceler | null>(null);

  const next = useCallback(_next, [uri, type, options, token]);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  useEffect(() => {
    if (token?.length) {
      axios.defaults.headers['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  useEffect(() => {
    if (type === FetchType.GET) {
      next({}).catch((err) => {
        if (err.response?.status === 401 && historyRef.current) {
          historyRef.current.push('/login');
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

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
    if (!options.headers) {
      options.headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true"
      };
    }

    return constructRequest(uri, type, _options, body)
      .then(res => {
        setLoading(false);
        setErrorMessage(null);
        setData(res.data);
        return res;
      })
      .catch(err => {
        setLoading(false);

        if (err.code === 401) {
          history.push('/login');
          return;
        }

        setErrorMessage(err.response?.data ? err.response.data.message : 'Something went wrong.')
        throw err;
      });
  }

  return [data, isLoading, errorMessage, next, cancel];
}

export default useFetchData;