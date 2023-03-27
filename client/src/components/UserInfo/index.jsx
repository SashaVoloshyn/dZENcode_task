import React from 'react';
import styles from './UserInfo.module.scss';
import { mainConfig } from '../../configs/main.config';

export const UserInfo = ({ avatar, userName, email }) => {
    return (
        <div className={styles.root}>
            {avatar && avatar !== 'undefined' ? (
                <img className={styles.avatar} src={`${mainConfig.CLOUD_DOMAIN_NAME}${avatar}`} alt={userName} />
            ) : (
                <img className={styles.avatar} src={process.env.PUBLIC_URL + '/noavatar.png'} alt={`ava`} />
            )}
            <div className={styles.userDetails}>
                <span className={styles.userName}>{userName}</span>
                <span className={styles.additional}>{email}</span>
            </div>
        </div>
    );
};
