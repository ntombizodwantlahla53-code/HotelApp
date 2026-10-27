export interface Room{
    room_id: number,
    hotel_id: number,
    description: string,
    ammenities: string,
    capacity: number, 
    quantity: number,
    price: number,
    image_urls:string[],
    created_at: Date,
    updated_at: Date

}
export type NewRoom = Omit<Room, 'room_id' | 'created_at' | 'updated_at' | 'hotel_id'>