import { gql } from '@apollo/client';

// Define la consulta GraphQL
export const GET_STATISTICS = gql`
  query Statistics($where: StatisticWhereInput!, $orderBy: [StatisticOrderByInput!], $take: Int) {
    statistics(where: $where, orderBy: $orderBy, take: $take) {
      air_humidity
      air_temperature
      soil_moisture
      timestamp
      id
    }
  }
`

export const GET_STATISTICS_BY_DAY = gql`
  query Query($where: StatisticWhereInput!) {
    statistics(where: $where) {
      air_temperature
      air_humidity
      soil_moisture
      timestamp
    }
  }
`
