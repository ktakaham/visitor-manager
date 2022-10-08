/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "query selectUsers {\n  users {\n    user_id\n    name\n    inserted_at\n  }\n}": types.SelectUsersDocument,
};

export function graphql(source: "query selectUsers {\n  users {\n    user_id\n    name\n    inserted_at\n  }\n}"): (typeof documents)["query selectUsers {\n  users {\n    user_id\n    name\n    inserted_at\n  }\n}"];

export function graphql(source: string): unknown;
export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;