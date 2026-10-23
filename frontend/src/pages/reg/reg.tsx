import styles from "./reg.module.css"
import { IoIosAddCircle } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../Redux/store";
import { fetchRegs, updateRegister, clearRegister } from "../../components/features/regslice";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

type ButtonProps = {
  type?: "button" | "submit" | "reset";
  label: string;
  icon?: React.ReactNode;
  variant?: string;
};

const Buttons = ({ type = "button", label, icon, variant }: ButtonProps) => (
  <button type={type} data-variant={variant}>
    {icon}
    {label}
  </button>
);

export const reg = () => {
  const info = useSelector((state: RootState) => state.register.info);
  const loading = useSelector((state: RootState) => state.register.loading);
  const error = useSelector((state: RootState) => state.register.error);

  const dispatch = useDispatch<AppDispatch>();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (info.password !== info.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!info.name) {
      alert("Name cannot be empty. Please enter a name.");
      return;
    }
    
    if (!info.email) {
      alert("Email cannot be empty. Please enter an email address.");
      return;
    }
    if (!info.password) {
    alert("Password cannot be empty. Please enter a password.");
      return;
    }
    dispatch(
      fetchRegs({
        name: info.name,
        email: info.email,
        password: info.password,
        confirmPassword: info.confirmPassword,
      }))
      .unwrap()
      .then(() => {
        dispatch(clearRegister());
     
      })
      .catch(() => {});
  };
  return (
    <div className={styles.linkContainer}>
      <div className={styles.Topic}>
        
        <Link to="/">
        <div className={styles.bc}>
         <FaHome/>
        </div>
      </Link>
        <h1 className={styles.Mytitle}>Create Account</h1>

        <p className={styles.Myp}>
          Create a new account to get started and enjoy seamless
          access to our features.
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.insideContainer}>
          <div className={styles.linkss}>
            <div className={styles.title}>
              <label>Name
              <input className={styles.inputtitle}
                placeholder="Name"
                value={info.name}
                onChange={(e) =>dispatch(updateRegister({name: e.target.value,})
                  )}/></label>
            </div>
            <div className={styles.descc}>
              <label>Email Address
              <input className={styles.inputtitle}
                placeholder="Email Address"
                type="email"
                value={info.email}
                onChange={(e) =>dispatch(updateRegister({email: e.target.value,})
                  )
                }/></label>
            </div>
            <div className={styles.desc}>
              <label>Password
              <input className={styles.inputtitle}
                placeholder="Password"
                type="password"
                value={info.password}
                onChange={(e) =>dispatch(updateRegister({password: e.target.value,})
                  )
                }/></label>
            </div>
            <div className={styles.desc}>
              <label>Confirm Password
              <input className={styles.inputtitle}
                placeholder="Confirm Password"
                type="password"
                value={info.confirmPassword}
                onChange={(e) =>dispatch(updateRegister({confirmPassword: e.target.value,})
                  )
                }/></label>
            </div>
            <Buttons type="submit"
              label={loading ? "Creating..." : "Create Account"}
              icon={<IoIosAddCircle />}
              variant="inputting"/>
            {error && <p>{error}</p>}
            <p className={styles.text}>
              Already have an account?
            <Link to="/Login">
              Sign In
            </Link></p>
         
          </div>
        </div>
      </form>
    </div>
  );
};