import { useQuery, UseQueryResult } from 'react-query'
import { DocumentNode, print } from 'graphql'
import { useClient } from '@/app/hooks/useClient'
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
  suspense
}: {
  queryKey: string[]
  document: DocumentNode
  variables: Record<string, unknown>
  suspense?: boolean
}): UseQueryResult<T> => {
  const client = useClient()
  const query = print(document)
  const request: Parameters<ZAFClient['request']>[0] = {
    url: `${import.meta.env.VITE_TANGLE_API_BASE_URL}/graphql`,
    type: 'POST',
    contentType: 'application/json',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': import.meta.env.VITE_TANGLE_API_KEY
    },
    data: JSON.stringify({ query, variables }),
    secure: import.meta.env.PROD,
    cors: !import.meta.env.PROD
  }

  return useQuery<T>({
    queryKey,
    queryFn: async () => {
      const response = await client.request<T>(request)
      if (isCorsResponse<T>(response)) {
        return response.data
      }
      return response.responseJSON
    },
    suspense
  })
}
