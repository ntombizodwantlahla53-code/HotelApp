import { query } from "../config/database";
import { Room, NewRoom } from "./../types/room.types"

export const createRoom = async (
  appData: NewRoom,
  hotel_id: number
): Promise<Room> => {
    const { name,description, ammenities, capacity, quantity, price, image_urls } = appData;
    const { rows } = await query(
        "INSERT INTO rooms (hotel_id, name, description, ammenities, capacity, quantity, price, image_urls) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [hotel_id, name, description, ammenities, capacity, quantity, price, image_urls],
    );
    return rows[0];
};

export const findAllRooms = async (
  hotel_id: number
): Promise<Room[]> => {
  const { rows } = await query(
    "SELECT * FROM rooms WHERE hotel_id = $1",
    [hotel_id]
  );
  return rows;
};

export const updateRoom = async (
  room_id: number,
  appData: NewRoom
): Promise<Room | null> => {
  const { name, description, ammenities, capacity, quantity, price, image_urls } = appData;
  const { rows } = await query(
    `UPDATE rooms SET name = $1, description = $2, ammenities = $3, capacity = $4, quantity = $5,
     price = $6, image_urls = $7, updated_at = NOW()
     WHERE room_id = $8 RETURNING *`,
    [name ,description, ammenities, capacity, quantity, price, image_urls, room_id],
  );
  return rows[0] || null;
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