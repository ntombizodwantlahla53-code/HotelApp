import { query } from "../config/database";
import { Hotel, NewHotel } from "./../types/hotel.types"

export const createHotel = async (
  appData: NewHotel,
  user_id: number
): Promise<Hotel> => {
  const {name, description, address,city,country,ammenities,star_rating, image_url} = appData;
  const { rows } = await query(
    "INSERT INTO hotels (user_id, name, description, address, city, country, ammenities, star_rating, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
    [user_id, name, description, address, city, country, ammenities, star_rating, image_url],
  );
  return rows[0];
};
export const findAllHotels = async (): Promise<Hotel[]> => {
  const { rows } = await query(
    "SELECT * FROM hotels",
  );
  return rows;
};

export const deleteHotel = async (
  hotel_id: number,
): Promise<Hotel | null> => {
  const { rows } = await query(
    "DELETE FROM hotels WHERE hotel_id = $1 RETURNING *",
    [hotel_id],
  );
  return rows[0] || null;
};