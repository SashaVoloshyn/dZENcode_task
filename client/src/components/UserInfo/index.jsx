import React from 'react';
import styles from './UserInfo.module.scss';

export const UserInfo = ({ avatar, userName, email }) => {

  console.log(userName);
  return (
    <div className={styles.root}>
      <img className={styles.avatar} src={avatar || '/noavatar.png'} alt={userName} />
      <div className={styles.userDetails}>
        <span className={styles.userName}>{userName}</span>
        <span className={styles.additional}>{email}</span>
      </div>
    </div>
  );
};
