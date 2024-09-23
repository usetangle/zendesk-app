/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** RFC 3339-compliant date and time */
  DateTime: { input: any; output: any; }
};

export type AddressObject = {
  __typename?: 'AddressObject';
  html: Scalars['String']['output'];
  text: Scalars['String']['output'];
  value: Array<EmailAddress>;
};

export type DateRange = {
  end?: InputMaybe<Scalars['DateTime']['input']>;
  start?: InputMaybe<Scalars['DateTime']['input']>;
};

export type Email = {
  __typename?: 'Email';
  bcc: Array<AddressObject>;
  body?: Maybe<EmailBody>;
  cc: Array<AddressObject>;
  connectionId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  date?: Maybe<Scalars['DateTime']['output']>;
  from?: Maybe<AddressObject>;
  id: Scalars['ID']['output'];
  inReplyTo?: Maybe<Scalars['String']['output']>;
  messageId?: Maybe<Scalars['String']['output']>;
  references?: Maybe<Array<Scalars['String']['output']>>;
  replyTo?: Maybe<AddressObject>;
  status?: Maybe<EmailStatusEnum>;
  subject?: Maybe<Scalars['String']['output']>;
  to?: Maybe<Array<AddressObject>>;
  updatedAt: Scalars['DateTime']['output'];
};

export type EmailAddress = {
  __typename?: 'EmailAddress';
  address: Scalars['String']['output'];
  group?: Maybe<Array<EmailAddress>>;
  name?: Maybe<Scalars['String']['output']>;
};

export type EmailBody = {
  __typename?: 'EmailBody';
  html?: Maybe<Scalars['String']['output']>;
  text?: Maybe<Scalars['String']['output']>;
};

export type EmailFilters = {
  address?: InputMaybe<Scalars['String']['input']>;
  body?: InputMaybe<Scalars['String']['input']>;
  connectionId?: InputMaybe<Array<Scalars['String']['input']>>;
  dateRange?: InputMaybe<DateRange>;
  id?: InputMaybe<Scalars['String']['input']>;
  subject?: InputMaybe<Scalars['String']['input']>;
};

export type EmailInput = {
  /** createdAt as cursor */
  after?: InputMaybe<Scalars['DateTime']['input']>;
  filters?: InputMaybe<EmailFilters>;
  pageSize?: InputMaybe<Scalars['Float']['input']>;
};

/** Possible statuses for an email */
export enum EmailStatusEnum {
  Attempted = 'ATTEMPTED',
  Bounced = 'BOUNCED',
  Clicked = 'CLICKED',
  Converted = 'CONVERTED',
  Delivered = 'DELIVERED',
  Drafted = 'DRAFTED',
  Dropped = 'DROPPED',
  Failed = 'FAILED',
  Opened = 'OPENED',
  Sent = 'SENT',
  Spammed = 'SPAMMED',
  Undeliverable = 'UNDELIVERABLE',
  Unsubscribed = 'UNSUBSCRIBED'
}

export type PaginatedEmailResponse = {
  __typename?: 'PaginatedEmailResponse';
  hasMore: Scalars['Boolean']['output'];
  items: Array<Email>;
};

export type Query = {
  __typename?: 'Query';
  emails: Array<Email>;
  emailsPaginated: PaginatedEmailResponse;
};


export type QueryEmailsArgs = {
  input?: InputMaybe<EmailInput>;
};


export type QueryEmailsPaginatedArgs = {
  input?: InputMaybe<EmailInput>;
};

export type EmailsQueryVariables = Exact<{
  address: Scalars['String']['input'];
  after?: InputMaybe<Scalars['DateTime']['input']>;
  pageSize?: InputMaybe<Scalars['Float']['input']>;
}>;


export type EmailsQuery = { __typename?: 'Query', emailsPaginated: { __typename?: 'PaginatedEmailResponse', hasMore: boolean, items: Array<{ __typename?: 'Email', id: string, createdAt: any, subject?: string | null, date?: any | null, status?: EmailStatusEnum | null, from?: { __typename?: 'AddressObject', value: Array<{ __typename?: 'EmailAddress', address: string, name?: string | null }> } | null, to?: Array<{ __typename?: 'AddressObject', value: Array<{ __typename?: 'EmailAddress', address: string, name?: string | null }> }> | null }> } };

export type EmailQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type EmailQuery = { __typename?: 'Query', emails: Array<{ __typename?: 'Email', date?: any | null, subject?: string | null, from?: { __typename?: 'AddressObject', value: Array<{ __typename?: 'EmailAddress', address: string, name?: string | null }> } | null, to?: Array<{ __typename?: 'AddressObject', value: Array<{ __typename?: 'EmailAddress', address: string, name?: string | null }> }> | null, cc: Array<{ __typename?: 'AddressObject', value: Array<{ __typename?: 'EmailAddress', address: string, name?: string | null }> }>, bcc: Array<{ __typename?: 'AddressObject', value: Array<{ __typename?: 'EmailAddress', address: string, name?: string | null }> }>, body?: { __typename?: 'EmailBody', html?: string | null, text?: string | null } | null }> };


export const EmailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Emails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"address"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emailsPaginated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"filters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"address"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"from"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"to"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasMore"}}]}}]}}]} as unknown as DocumentNode<EmailsQuery, EmailsQueryVariables>;
export const EmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Email"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"filters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"from"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"to"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"bcc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"body"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"html"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}}]}}]} as unknown as DocumentNode<EmailQuery, EmailQueryVariables>;