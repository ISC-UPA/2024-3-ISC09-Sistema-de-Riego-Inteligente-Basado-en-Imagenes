import { gql } from "@apollo/client";

export interface User {
  id: string; 
  full_name: string; 
  email: string; 
  profile_picture: string | null; 
}

interface Ranch {
  id: string;
  ranch_name: string;
  description: string;
}

interface UserData {
  user: {
    ranch_id: Ranch[];
  };
}

interface Crop {
  id: string;
  crop_name: string;
  location: string;
  latitude: number;
  longitude: number;
}

interface UserCropsData {
  user: {
    crop: Crop[];
  };
}

export const GET_USER = gql`query Query($where: UserWhereUniqueInput!) {
  user(where: $where) {
    id
    full_name
    email
    profile_picture
  }
}`

export const GET_RANCH = gql`query Query($where: UserWhereUniqueInput!) {
  user(where: $where) {
    ranch_id {
      id
      ranch_name
      description
    }
  }
}
`

export const GET_CROP = gql`query Query($where: CropWhereUniqueInput!) {
  crop(where: $where) {
    id
    crop_name
    location
    latitude
    longitude
  }
}
`
export const GET_USER_CROPS = gql`query Query($where: UserWhereUniqueInput!) {
  user(where: $where) {
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