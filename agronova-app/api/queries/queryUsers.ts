import { gql } from "@apollo/client";

export interface User{
    fullName: string
    email: string
}

export const GET_USERS = gql`query Query {
    users {
      full_name
      email
    }
  }`