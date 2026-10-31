import { useDispatch, useSelector } from "react-redux";
import styles from "./payment.module.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import type { RootState, AppDispatch } from "../../Redux/store";
import { startPayment } from "../../components/features/paymentslice";

export const payment = () => {
  const loading = useSelector((state: RootState) => state.payment.loading);
  const error = useSelector((state: RootState) => state.payment.error);

  const dispatch = useDispatch<AppDispatch>();
  const { booking_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const total = Number(location.state?.total || 0);

  const handlePay = () => {
    dispatch(startPayment(Number(booking_id)))
      .unwrap()
      .then((payment_url) => {
        window.location.href = payment_url;
      })
      .catch(() => {});
  };

  return (
    <div className={styles.payment}>
      <div className={styles.box}>
        <h1 className={styles.heading}>Pay for your booking</h1>
        <p className={styles.text}>Booking number: {booking_id}</p>
        <p className={styles.amount}>R{total.toFixed(2)}</p>
        {error && <p className={styles.error}>{error}</p>}
        <button className={styles.button} onClick={handlePay} disabled={loading}>
          {loading ? "Please wait..." : "Pay with Paystack"}
        </button>
        <button className={styles.ghost} onClick={() => navigate("/")}>Pay later</button>
      </div>
    </div>
  );
};

export default payment;
