import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useSuspenseInfiniteQuery,
  UseSuspenseInfiniteQueryResult
} from '@tanstack/react-query'
import { DocumentNode, print } from 'graphql'
import { useClient } from '@/app/hooks/use-client'
import { ZAFClient } from '@/types/zendesk'

type CorsResponse<T> = { data: T }
type NonCorsResponse<T> = {
  status: number
  statusText: string
  responseText: string
  responseJSON: T
}

function isCorsResponse<T>(response: CorsResponse<T> | NonCorsResponse<T>): response is CorsResponse<T> {
  return 'data' in response
}

export const useGraphqlQuery = <T>({
  queryKey,
  document,
  variables,
  getNextPageParam,
  pageSize,
  staleTime
}: {
  queryKey: string[]
  document: DocumentNode
  variables?: Record<string, unknown>
  getNextPageParam?: (lastPage: T, pages: T[]) => string
  pageSize?: number
  staleTime?: number
}) => {
  const client = useClient()
  const query = print(document)

  const hasEmptyStringVariable = Object.values(variables ?? {}).some((value) => value === '')

  return useSuspenseInfiniteQuery<T>({
    queryKey,
    initialPageParam: '',
    queryFn: async ({ pageParam }) => {
      const request: Parameters<ZAFClient['request']>[0] = {
        url: `${import.meta.env.VITE_TANGLE_API_BASE_URL}/graphql`,
        type: 'POST',
        contentType: 'application/json',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': import.meta.env.VITE_TANGLE_API_KEY
        },
        data: JSON.stringify({ query, variables: { ...variables, after: pageParam, pageSize } }),
        secure: import.meta.env.PROD,
        cors: !import.meta.env.PROD
      }

      const response = await client.request<T>(request)
      if (isCorsResponse<T>(response)) {
        return response.data
      }
      return response.responseJSON
    },
    getNextPageParam: getNextPageParam ?? (() => undefined),
    staleTime: staleTime ?? 60 * 1000
  })
}
