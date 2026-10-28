import { query } from "../config/database";
import { Room, NewRoom } from "./../types/room.types"

export const createRoom = async (
  appData: NewRoom,
  hotel_id: number
): Promise<Room> => {
    const { description, ammenities, capacity, quantity, price, image_urls } = appData;
    const { rows } = await query(
        "INSERT INTO rooms (hotel_id, description, ammenities, capacity, quantity, price, image_urls) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [hotel_id, description, ammenities, capacity, quantity, price, image_urls],
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
  const { description, ammenities, capacity, quantity, price, image_urls } = appData;
  const { rows } = await query(
    `UPDATE rooms SET description = $1, ammenities = $2, capacity = $3, quantity = $4,
     price = $5, image_urls = $6, updated_at = NOW()
     WHERE room_id = $7 RETURNING *`,
    [description, ammenities, capacity, quantity, price, image_urls, room_id],
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