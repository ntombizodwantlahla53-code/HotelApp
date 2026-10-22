import styles from './navbar.module.css'

export const navbar = () => {
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <nav>
        <div className={styles.navbar}>
            <div className={styles.logo}>
                <h1 className={styles.blue}>Book</h1>
                <h1>Hotel</h1>
            </div>

            <div className={styles.links}>
            {token ? (
              <a href="/" onClick={handleLogout} className={styles.link}>Log out</a>
            ) : (
              <>
                <a href="/Login" className={styles.link}>Sign In</a>
                <a href="/Register" className={styles.link}>Sign Up</a>
              </>
            )}
            </div>
        </div>
    </nav>
  )
}
export default navbar