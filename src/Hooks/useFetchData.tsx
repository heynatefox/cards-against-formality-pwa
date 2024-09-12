import { useState, useEffect, useCallback, useRef, useContext } from "react";
import { useNavigate } from "react-router";
import { getAuth } from "firebase/auth";
import axios, { AxiosRequestConfig, AxiosResponse, Canceler } from 'axios';

import ConfigContext from "../Contexts/ConfigContext";
import { FirebaseContext } from "../Contexts/FirebaseProvider";

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

const defaultOption = Object.freeze({});

/**
 *
 *
 * @param {string} uri
 * @param {FetchType} [type=FetchType.GET]
 * @param {AxiosRequestConfig} [options]
 * @returns {([T, boolean, string | null, (body: any, noRedirect?: boolean) => void, () => void])}
 */
function useFetchData<T>(
  uri: string,
  type: FetchType = FetchType.GET,
  options: AxiosRequestConfig = defaultOption,
  interval?: number
): [T | null, boolean, string | null, (body?: any, noRedirect?: boolean) => Promise<any>, () => void] {
  const { baseUrl } = useContext(ConfigContext);
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  const firebase = useContext(FirebaseContext);
  const firebaseRef = useRef(firebase);

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const cancelToken = useRef<Canceler | null>(null);

  const next = useCallback(_next, [baseUrl, uri, type, options]);

  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  useEffect(() => {
    firebaseRef.current = firebase;
  }, [firebase]);

  useEffect(() => {
    if (type === FetchType.GET) {
      next().catch(() => { });
    }
  }, [type, next, interval])

  function cancel() {
    if (cancelToken.current) {
      cancelToken.current();
    }
  }

  function _next(body?: any, noRedirect?: boolean) {
    if (cancelToken.current) {
      cancel();
    }

    const currentUser = firebaseRef.current ? getAuth(firebaseRef.current)?.currentUser : undefined;
    if (!currentUser) {
      return Promise.reject(new Error('No user.'));
    }

    setLoading(true);
    const _options = Object.assign({}, options, { cancelToken: new axios.CancelToken(token => cancelToken.current = token) });
    return currentUser.getIdToken()
      .then(token => {
        if (token?.length) {
          axios.defaults.headers['Authorization'] = `Bearer ${token}`;
        }
        return constructRequest(`${baseUrl}${uri}`, type, _options, body)
      })
      .then(res => {
        setLoading(false);
        setErrorMessage(null);
        setData(res.data);
        return res;
      })
      .catch(err => {
        setLoading(false);
        if (!noRedirect && (err.code === 401 || err.response?.status === 401)) {
          navigateRef.current('/login');
          throw err;
        }

        setErrorMessage(err.response?.data ? err.response.data.message : 'Something went wrong.')
        throw err;
      });
  }

  return [data, isLoading, errorMessage, next, cancel];
}

export default useFetchData;