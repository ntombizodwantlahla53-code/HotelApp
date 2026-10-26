import { query } from "../config/database";
import { Hotel } from "../types/hotel.types";
import { Newfavourate } from "../types/favourate.types"

export const findMyFavourates = async (user_id: number): Promise<Hotel[]> => {
    const { rows } = await query(
        `SELECT h.* FROM favourates f
        JOIN hotels h ON f.hotel_id = h.hotel_id
        WHERE f.user_id = $1
        ORDER BY h.hotel_id DESC`,
        [user_id]
    );
    return rows;
};

export const createfavourate = async (favourate: Newfavourate): Promise<Hotel | null> => {
    const { rows } = await query(
        "SELECT * FROM hotels WHERE hotel_id = $1",
        [favourate.hotel_id]
    );
    if (!rows[0]) {
        return null;
    }
    await query(
        `INSERT INTO favourates (user_id, hotel_id)
        SELECT $1::int, $2::int
        WHERE NOT EXISTS (
            SELECT 1 FROM favourates WHERE user_id = $1::int AND hotel_id = $2::int
        )`,
        [favourate.user_id, favourate.hotel_id]
    );
    return rows[0];
};

export const deletefavourate = async (user_id: number, hotel_id: number): Promise<boolean> => {
    const { rowCount } = await query(
        "DELETE FROM favourates WHERE user_id = $1 AND hotel_id = $2",
        [user_id, hotel_id]
    );
    return (rowCount ?? 0) > 0;
};