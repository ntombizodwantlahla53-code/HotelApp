export interface favourate {
    favourite_id: number;
    user_id: number;
    hotel_id: number;
}

export type Newfavourate = Omit<favourate, 'favourite_id'>;