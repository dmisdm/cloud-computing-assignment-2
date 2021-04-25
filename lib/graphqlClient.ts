import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  readonly __typename?: 'Query';
  readonly hello: Scalars['String'];
};

export type IndexPageQueryVariables = Exact<{ [key: string]: never; }>;


export type IndexPageQuery = (
  { readonly __typename?: 'Query' }
  & Pick<Query, 'hello'>
);


export const IndexPageDocument = gql`
    query IndexPage {
  hello
}
    `;

export function useIndexPageQuery(options: Omit<Urql.UseQueryArgs<IndexPageQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<IndexPageQuery>({ query: IndexPageDocument, ...options });
};