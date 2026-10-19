import styles from "./login.module.css";
import { IoIosAddCircle } from "react-icons/io";
import {useSelector,useDispatch,} from "react-redux";
import type {RootState,AppDispatch,} from "../../Redux/store";
import {Link, useNavigate} from "react-router-dom";
import {fetchLogs,updateLogin,clearLogin,} from "../../components/features/loginslice"
import { MdArrowBackIos } from "react-icons/md";

export const log = () => {
  const info = useSelector((state: RootState) => state.login.info);
  const loading = useSelector((state: RootState) => state.login.loading);
  const error = useSelector((state: RootState) => state.login.error);

  const dispatch = useDispatch<AppDispatch>();
   const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
 
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
      fetchLogs({
        name: info.name,
        email: info.email,
        password: info.password,
      }))
      .unwrap()
      .then((data) => {
        dispatch(clearLogin());

        if(data.user.role === 'Admin'){
          navigate('/admin')
        }else{
          navigate('/')
        }
     
      })
      .catch(() => {});
  };
  return (
    <div className={styles.linkContainer}>
      <Link to="/">
        <div className={styles.bc}>
          <MdArrowBackIos />
        </div>
      </Link>
      <div className={styles.Topic}>
        <h1 className={styles.Mytitle}>Log in</h1>
        <p className={styles.Myp}>
          Enter your email and password to securely
          access your account.
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.insideContainer}>
          <div className={styles.linkss}>
            <div className={styles.title}>
              <label>name</label>
              <input className={styles.inputtitle}
                value={info.name}
                type="text"
                onChange={(e) =>dispatch(updateLogin({name: e.target.value,}))}
                placeholder="Name"/>
            </div>
            <div className={styles.title}>
              <label>Email Address</label>
              <input className={styles.inputtitle}
                value={info.email}
                type="email"
                onChange={(e) =>dispatch(updateLogin({email: e.target.value,}))}
                placeholder="Email Address"/>
            </div>
            <div className={styles.desc}>
              <label>Password</label>
              <input className={styles.inputdesc}
                value={info.password}
                onChange={(e) =>dispatch(updateLogin({password: e.target.value,}))}
                type="password"
                placeholder="Password"/>
            </div>

            <p className={styles.password}>
              Forgot Password
            </p>
            
            <button type="submit" className={styles.inputting}>
              <IoIosAddCircle /> {loading ? "Logging in..." : "Log in"}
            </button>

            {error && (<p>{error}</p>
            )}
            <p className={styles.text}>
              Don't have an account?
            </p>
            <Link to="/register">
              Sign Up
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};