/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ZAFClient {
  on(event: string, callback: (...args: any[]) => void): void
  invoke(method: string, ...args: any[]): Promise<any>
  get<T extends string>(path: T): Promise<{ errors: object } & Record<T, any>>
  set(path: string, value: any): Promise<void>
  request<T = any>(options: {
    url: string
    type?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    headers?: {
      Authorization?: string
      'X-API-Key'?: string
      [key: string]: string | undefined
    }
    contentType?: 'application/json' | string
    data: string
    secure?: boolean
    /**
     * If true, makes a request from the browser. If false, makes a request from a Zendesk proxy server.
     * Defaults to false.
     * @note Requests to Zendesk APIs are always made from the browser, regardless of this option.
     */
    cors?: boolean
  }): Promise<
    | { data: T }
    | {
        status: number
        statusText: string
        responseText: string
        responseJSON: T
      }
  >
  context(): Promise<{
    account: {
      subdomain: string
    }
    currentUser: {
      id: number
      name: string
      email: string
    }
    location: string
    app: {
      id: number
      name: string
    }
    instance: {
      location: string
      instanceGuid: string
      product: string
    }
  }>
}

declare global {
  interface Window {
    ZAFClient: {
      init(): ZAFClient
    }
  }
}

export interface Requester {
  id: number
  name: string
  email: string
  details: string | null
  notes: string | null
  customFields: Record<string, any>
  tags: string[]
  timeZone: string
  locale: string
  active: boolean
  verified: boolean
  sharedPhoneNumber: boolean
  sharedAgent: boolean
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
}

export {}
