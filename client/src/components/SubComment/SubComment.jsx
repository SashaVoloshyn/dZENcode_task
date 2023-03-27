import { IconButton } from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import { UserInfo } from '../UserInfo';
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import DeleteIcon from '@mui/icons-material/Clear';
import styles from './SubComment.module.scss';
import { mainConfig } from '../../configs/main.config';
import { deleteComments } from '../../redux/slices/comments';
import axios from 'axios';
import { saveAs } from 'file-saver';

const SubComment = ({ comment: { created_at, user, id, text, fileImg, fileText }, dispatch, isEditable }) => {

    const onClickRemove = async () => {
        try {
            const clientKey = window.localStorage.getItem('clientKey');
            const confirmation = window.confirm('Ви дійсно хочете видалити ваш комментар?');
            if (confirmation) {
                await dispatch(deleteComments({ id, clientKey }));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleDownload = async () => {
        try {
            const fileUrl = mainConfig.CLOUD_DOMAIN_NAME + fileText;
            const response = await axios.get(fileUrl, {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin': '*',
                },
            });

            const contentDispositionHeader = response.headers['content-disposition'];
            const filename = contentDispositionHeader
                ? contentDispositionHeader.split('filename=')[1].trim()
                : 'file.txt';

            const blob = new Blob([response.data], { type: 'text/plain' });
            saveAs(blob, filename);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={clsx(styles.root)}>
            {isEditable && (
                <div className={styles.editButtons}>
                    <IconButton onClick={onClickRemove} color="secondary">
                        <DeleteIcon />
                    </IconButton>
                </div>
            )}
            <div className={styles.wrapper}>
                <UserInfo {...user} additionalText={created_at} />
                <div className={styles.indention}>
                    <p className={styles.created_at}>{created_at.slice(0, 10) + ' ' + created_at.slice(11, 16)}</p>
                    <p className={styles.text}>{text}</p>
                </div>
                {fileImg && (
                    <img className={styles.image} src={`${mainConfig.CLOUD_DOMAIN_NAME}${fileImg}`} alt={fileImg} />
                )}
                <ul className={styles.mainCommentDetails}>
                    {fileText && (
                        <li onClick={handleDownload}>
                            <SimCardDownloadIcon /> <span>file.txt</span>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default SubComment;
