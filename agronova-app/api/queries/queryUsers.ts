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
    phone_number
    profile_picture
    ranch_id {
      id
    }
    accountStatus
    role
  }
}`

//Crea un usuario de un rancho
// Variables
// {
//   "data": {
//     "full_name": "",
//     "email": "",
//     "phone_number": "",
//     "ranch_id": {
//       "connect": {
//         "id": "id del ranchp"
//       }
//     },
//     "role": "crop_worker o administrator o agronomist o irrigation_manager",
//     "accountStatus": "active"
//   }
// }
export const CREATE_USER = gql`mutation Mutation($data: UserCreateInput!) {
  createUser(data: $data) {
    id
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

//Traer todos los cultivos a los que pertenece un usuario
// Variables
// {
//   "where": {
//     "id": "{id usuario}"
//   },
//   "cropsWhere2": {
//     "isDeleted": {
//       "equals": false
//     }
//   }
// }
export const GET_USER_CROPS = gql`query User($where: UserWhereUniqueInput!, $cropsWhere2: CropWhereInput!) {
  user(where: $where) {
    crops(where: $cropsWhere2) {
      id
      crop_name
      location
      latitude
      longitude
      device {
        id
        serial_number
      }
    }
  }
}`

//Trae todos los cultivos de un rancho con su id
// Variables 
// "where": {
//   "id": "{Id del rancho}"
// },
// "cropWhere2": {
//   "isDeleted": {
//     "equals": false
//   }
// }
export const GET_RANCH_CROPS = gql`query Query($where: RanchWhereUniqueInput!, $cropWhere2: CropWhereInput!) {
  ranch(where: $where) {
    crop(where: $cropWhere2) {
      id
      crop_name
      location
      latitude
      longitude
      device {
        id
        serial_number
      }
    }
  }
}
`

//Crear un rancho 
// {
//   "data": {
//     "ranch_name": null,
//     "description": null,
//     "user": {
//       "connect": [
//         {
//           "id": "{id del administrador}"
//         }
//       ]
//     }
//   }
// }
export const CREATE_RANCH = gql`mutation Mutation($data: RanchCreateInput!) {
  createRanch(data: $data) {
    id
  }
}`

//Obtiene el rancho junto con todos los miembros de los ranchos
// Variables
// "where": {
//   "id": "{id del rancho}"
// }

export const GET_RANCH_MEMBERS = gql`
query Query($where: RanchWhereUniqueInput!) {
  ranch(where: $where) {
    id
    ranch_name
    user {
      id
      full_name
      email
      phone_number
      profile_picture
      role
      accountStatus
    }
  }
}`


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
    device {
      id
      serial_number
    }
  }
}`

//Crea un cultivo
// Variables
// "data": {
//   "crop_name": "",
//   "location": "",
//   "latitude": ,
//   "longitude": ,
//   "users": {
//     "connect": [
//       {
//         "id": "{id del usuario}"
//       }
//     ]
//   },
//   "ranch_id": {
//     "connect": {
//       "id": "{id del rancho}"
//     }
//   }
// }
export const CREATE_CROP = gql`mutation Mutation($data: CropCreateInput!) {
  createCrop(data: $data) {
    id
  }
}`


//Elimina un cultivo con una id
// Variables
// "where": {
//   "id": "{id del cultivo}"
// },
// "data": {
//   "isDeleted": true
// }
export const DELETE_CROP = gql`mutation Mutation($where: CropWhereUniqueInput!, $data: CropUpdateInput!) {
  updateCrop(where: $where, data: $data) {
    id
    crop_name
  }
}
`

//Actulizar la información del cultivo
// Variables
//   "where": {
//     "id": "{id del cultivo}"
//   },
//   "data": {
//     "crop_name": "",
//     "location": "",
//     "latitude": ,
//     "longitude": 
//   }
export const UPDATE_CROP_INFO = gql`mutation Mutation($where: CropWhereUniqueInput!, $data: CropUpdateInput!) {
  updateCrop(where: $where, data: $data) {
    id
  }
}`