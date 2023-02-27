import React from 'react';
import styles from './UserInfo.module.scss';
import {mainConfig} from "../../configs/main.config";

export const UserInfo = ({ avatar, userName, email }) => {

  console.log(userName);
  return (
    <div className={styles.root}>
        {avatar ? <img className={styles.avatar} src={`${mainConfig.CLOUD_DOMAIN_NAME}${avatar}`} alt={userName} />
        : <img className={styles.avatar} src={"/noavatar.png"} alt={userName}  />}
      <div className={styles.userDetails}>
        <span className={styles.userName}>{userName}</span>
        <span className={styles.additional}>{email}</span>
      </div>
    </div>
  );
};
