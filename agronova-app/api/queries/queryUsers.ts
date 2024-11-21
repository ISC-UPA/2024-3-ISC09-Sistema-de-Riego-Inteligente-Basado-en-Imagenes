import { gql } from "@apollo/client";

export interface User {
  id: string; 
  full_name: string; 
  email: string; 
  profile_picture: string | null; 
}

export interface Ranch {
  id: string;
  ranch_name: string;
  description: string;
}

export interface Crop {
  id: string;
  crop_name: string;
  location: string;
  latitude: number;
  longitude: number;
}

// Resultado de GET_USER_RANCH
export interface GetUserRanchResponse {
  user: {
    ranch_id: Ranch | null; // Puede ser null si el usuario no tiene rancho asignado
  };
}

// Resultado de GET_RANCH_CROPS
export interface GetRanchCropsResponse {
  ranch: {
    crop: Crop[]; // Lista de cultivos del rancho
  };
}

//Trae la info del usuario con el email
// Variables
// "where": {
//   "email": "{email usuario}"
// }
export const GET_USER = gql`query Query($where: UserWhereUniqueInput!) {
  user(where: $where) {
    id
    full_name
    email
    profile_picture
  }
}`

//Trae el rancho al que pertenece el usuario
// Variables
// "where": {
//   "id": "{id usuario}"
// }
export const GET_USER_RANCH = gql`query Query($where: UserWhereUniqueInput!) {
  user(where: $where) {
    ranch_id {
      id
      ranch_name
      description
    }
  }
}
`

//Trae todos los cultivos de un rancho con su id
// Variables 
// "where": {
//   "id": "{Id del rancho}"
// }

export const GET_RANCH_CROPS = gql`query Query($where: RanchWhereUniqueInput!) {
  ranch(where: $where) {
    crop {
      id
      crop_name
      location
      latitude
      longitude
    }
  }
}
`


//Trae la info de un cultivo
// Variables
// "where": {
//   "id": "{id del cultivo}"
// }
export const GET_CROP_INFO = gql`query Query($where: CropWhereUniqueInput!) {
  crop(where: $where) {
    id
    crop_name
    location
    latitude
    longitude
  }
}`

