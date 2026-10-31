import styles from './navbar.module.css'

export const navbar = () => {
  const token = localStorage.getItem("token");
  const saveUser = localStorage.getItem("user");
  const isAdmin = saveUser ? JSON.parse(saveUser).role === "Admin" : false;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <nav className={styles.bar}>
      <div className={styles.navbar}>
        <a href="/" className={styles.logo}>
          <span className={styles.heart}>♡</span>
          <span className={styles.bookname}>Book</span>
          <span className={styles.hotelname}>Hotel</span>
        </a>

        <div className={styles.links}>
          {token ? (
            <>
              <a href="/Profile" className={styles.link}>Profile</a>
              {!isAdmin && (
                <a href="/Favourites" className={styles.link}>Favourites</a>
              )}
              <a href="/" onClick={handleLogout} className={styles.solid}>Log out</a>
            </>
          ) : (
            <>
              <a href="/Login" className={styles.link}>Sign In</a>
              <a href="/Register" className={styles.solid}>Sign Up</a>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
export default navbar
