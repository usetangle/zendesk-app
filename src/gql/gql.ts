/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query Emails($address: String!) {\n    emails(input: { filters: { address: $address } }) {\n      id\n      subject\n      date\n      from {\n        value {\n          address\n          name\n        }\n      }\n      to {\n        value {\n          address\n          name\n        }\n      }\n    }\n  }\n": types.EmailsDocument,
    "\n  query Email($id: String!) {\n    emails(input: { filters: { id: $id } }) {\n      date\n      from {\n        value {\n          address\n          name\n        }\n      }\n      to {\n        value {\n          address\n          name\n        }\n      }\n      cc {\n        value {\n          address\n          name\n        }\n      }\n      bcc {\n        value {\n          address\n          name\n        }\n      }\n      subject\n      body {\n        html\n        text\n      }\n    }\n  }\n": types.EmailDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Emails($address: String!) {\n    emails(input: { filters: { address: $address } }) {\n      id\n      subject\n      date\n      from {\n        value {\n          address\n          name\n        }\n      }\n      to {\n        value {\n          address\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Emails($address: String!) {\n    emails(input: { filters: { address: $address } }) {\n      id\n      subject\n      date\n      from {\n        value {\n          address\n          name\n        }\n      }\n      to {\n        value {\n          address\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Email($id: String!) {\n    emails(input: { filters: { id: $id } }) {\n      date\n      from {\n        value {\n          address\n          name\n        }\n      }\n      to {\n        value {\n          address\n          name\n        }\n      }\n      cc {\n        value {\n          address\n          name\n        }\n      }\n      bcc {\n        value {\n          address\n          name\n        }\n      }\n      subject\n      body {\n        html\n        text\n      }\n    }\n  }\n"): (typeof documents)["\n  query Email($id: String!) {\n    emails(input: { filters: { id: $id } }) {\n      date\n      from {\n        value {\n          address\n          name\n        }\n      }\n      to {\n        value {\n          address\n          name\n        }\n      }\n      cc {\n        value {\n          address\n          name\n        }\n      }\n      bcc {\n        value {\n          address\n          name\n        }\n      }\n      subject\n      body {\n        html\n        text\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;