import { useEffect, useState } from "react";
import styles from "./payments.module.css";

interface payment {
  booking_id: number;
  user_name: string;
  user_email: string;
  hotel_name: string;
  total_price: number;
  payment_status: string;
  paid_at: string | null;
}

export const payments = () => {
  const [allPayments, setAllPayments] = useState<payment[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/payments", { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => response.json())
      .then((data) => (Array.isArray(data) ? setAllPayments(data) : setError(data.message)))
      .catch(() => setError("Something went wrong"));
  }, []);

  const paidUsers = allPayments.filter((item) => item.payment_status === "Paid");
  const pendingUsers = allPayments.filter((item) => item.payment_status === "Pending");

  return (
    <div className={styles.payments}>
      {error && <p>{error}</p>}

      <h2>Users who paid ({paidUsers.length})</h2>
      {paidUsers.map((item) => (
        <p key={item.booking_id}>
          {item.user_name} ({item.user_email}) - {item.hotel_name} - R{Number(item.total_price).toFixed(2)} - paid {new Date(item.paid_at!).toLocaleString()}
        </p>
      ))}

      <h2>Users pending payment ({pendingUsers.length})</h2>
      {pendingUsers.map((item) => (
        <p key={item.booking_id}>
          {item.user_name} ({item.user_email}) - {item.hotel_name} - R{Number(item.total_price).toFixed(2)}
        </p>
      ))}
    </div>
  );
};

export default payments;