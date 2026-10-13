export interface Hotel{
    hotel_id: number,
    user_id: number,
    name: string,
    description: string,
    address: string,
    city: string,
    country: string,
    ammenities: string,
    star_rating: number | null,
    created_at: Date,
    updated_at: Date

}
export type NewHotel = Omit<Hotel, 'hotel_id' | 'created_at' | 'updated_at'>