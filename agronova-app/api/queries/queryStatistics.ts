import { gql } from '@apollo/client';

// Define la consulta GraphQL
export const GET_STATISTICS = gql`
  query Statistics($where: StatisticWhereInput!) {
    statistics(where: $where) {
      air_humidity
      air_temperature
      soil_moisture
      timestamp
      id
    }
  }
`;
