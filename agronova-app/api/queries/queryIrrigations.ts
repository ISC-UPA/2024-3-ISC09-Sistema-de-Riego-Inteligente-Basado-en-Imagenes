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
