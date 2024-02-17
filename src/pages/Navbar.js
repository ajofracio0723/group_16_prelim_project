import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './component/Navbar.module.css';

const Navbar = () => {
  const router = useRouter();
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(router.pathname);
  }, [router.pathname]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoText}>
        <span className={styles.logo}>Prelim Project</span>
      </div>
      <ul className={styles.navList}>
        <li className={`${styles.navItem} ${currentUrl === '/' ? styles.active : ''}`}>
          <Link href="/">
            Home
          </Link>
        </li>
        <li className={`${styles.navItem} ${currentUrl === '/posts' ? styles.active : ''}`}>
          <Link href="/posts">
            Posts
          </Link>
        </li>
        <li className={`${styles.navItem} ${currentUrl === '/comments' ? styles.active : ''}`}>
          <Link href="/comments">
            Comments
          </Link>
        </li>
        <li className={`${styles.navItem} ${currentUrl === '/users' ? styles.active : ''}`}>
          <Link href="/users">
            Users
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
