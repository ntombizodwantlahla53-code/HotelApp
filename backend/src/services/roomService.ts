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

export const findAllRooms = async (): Promise<Room[]> => {
  const { rows } = await query(
    "SELECT * FROM rooms",
  );
  return rows;
};

export const deleteRoom = async (
  room_id: number,
): Promise<Room | null> => {
  const { rows } = await query(
    "DELETE FROM rooms WHERE room_id = $1 RETURNING *",
    [room_id],
  );
  return rows[0] || null;
};