import { query } from "../config/database";
import { Room, NewRoom } from "./../types/room.types"

export const createRoom = async (
  appData: NewRoom,
  hotel_id: number
): Promise<Room> => {
    const {description, ammenities, capacity, quantity, price } = appData;
    const { rows } = await query( 
        "INSERT INTO rooms (hotel_id, description, ammenities, capacity, quantity, price ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [hotel_id, description, ammenities, capacity, quantity, price],
    );
    return rows[0];
};