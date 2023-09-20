const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];
export type HttpMethod = (typeof methods)[number];

export function _fetch(url: string, method: HttpMethod, payload?: unknown): Promise<Response> {
  return fetch(url, { method, body: JSON.stringify(payload) });
}

export type FetchJsonResult = {
  status: number;
  body: any;
};

export async function fetchJson(
  url: string,
  method: HttpMethod,
  payload?: object
): Promise<FetchJsonResult> {
  let response;

  try {
    response = await _fetch(url, method, JSON.stringify(payload));
  } catch (error) {
    console.error('Failed to fetch', error);

    return Promise.reject({ status: -1, body: { error } });
  }

  const result = { status: response.status, body: await response.json() };

  if (response.ok) {
    return result;
  }

  return Promise.reject(result);
}
