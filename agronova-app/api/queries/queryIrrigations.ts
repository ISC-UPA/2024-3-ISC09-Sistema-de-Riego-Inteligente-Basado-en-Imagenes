import { gql } from "@apollo/client";

export const GET_IRRIGATIONS = gql`
  query Irrigations($where: IrrigationWhereInput!) {
    irrigations(where: $where) {
      id
      start_time
      end_time
    }
  }
`;

export const GET_LAST_IRRIGATION = gql`
  query Irrigations($where: IrrigationWhereInput!, $take: Int, $orderBy: [IrrigationOrderByInput!]) {
    irrigations(where: $where, take: $take, orderBy: $orderBy) {
      id
      end_time
    }
  }
`;
