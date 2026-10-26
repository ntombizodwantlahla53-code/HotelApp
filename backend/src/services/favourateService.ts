import { query } from "../config/database";
import { Hotel } from "../types/hotel.types";
import { Newfavourate } from "../types/favourate.types";

export const findMyFavourates = async (
    userId: number
): Promise<Hotel[]> => {
  const { rows } = await query(
    `SELECT hotels.* 
     FROM favourites 
     JOIN hotels ON favourites.hotel_id = hotels.hotel_id 
     WHERE favourites.user_id = $1 
     ORDER BY favourites.favourite_id DESC`,
    [userId]
  );
  return rows;
};

export const createfavourate = async (
    favourite: Newfavourate
): Promise<Hotel | null> => {
  const { rows } = await query(
    "SELECT * FROM hotels WHERE hotel_id = $1",
    [favourite.hotel_id]
  );
  if (!rows[0]) {
    return null;
  }

  await query( `INSERT INTO favourites (user_id, hotel_id) 
     VALUES ($1, $2) 
     ON CONFLICT (user_id, hotel_id) 
     DO NOTHING`,
    [favourite.user_id, favourite.hotel_id]
  );

  return rows[0];
};

export const deletefavourate = async (
    userId: number, 
    hotel_id: number
): Promise<boolean> => {
  const { rowCount } = await query( "DELETE FROM favourites WHERE user_id = $1 AND hotel_id = $2",
    [userId, hotel_id]
  );

  return (rowCount ?? 0) > 0;
};