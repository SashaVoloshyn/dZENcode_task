import React, { useState } from 'react';
import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import CommentIcon from '@mui/icons-material/Comment';
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import AddCommentIcon from '@mui/icons-material/AddComment';
import ReactHtmlParser from 'html-react-parser';
import { UserInfo } from '../UserInfo';
import { MainCommentSkeleton } from './Skeleton';
import { mainConfig } from '../../configs/main.config';
import styles from './MainComment.module.scss';
import axios from 'axios';
import SubComment from '../SubComment/SubComment';
import { AddSubComment } from '../AddSubComment/AddSubComment';
import { deleteMainComments } from '../../redux/slices/mainComments';

import { saveAs } from 'file-saver';

export const MainComment = ({
    id,
    dispatch,
    text,
    created_at,
    fileImg,
    pageUrl,
    comments,
    user,
    fileText,
    isAuth,
    children,
    isFullMainComment,
    isLoading,
}) => {
    if (isLoading) {
        return <MainCommentSkeleton />;
    }

    const isEditable = isAuth?.data.id === user.id;

    const onClickRemove = async () => {
        const clientKey = window.localStorage.getItem('clientKey');
        const confirmation = window.confirm('Ви дійсно хочете видалити комментар?');
        if (confirmation) {
            await dispatch(deleteMainComments({ id, clientKey }));
        }
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [haveSubcomments, setHaveSubComments] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isAdding, setIsAdding] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isFullSize, setIsFullSize] = useState(false);

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

    let htmlText = ReactHtmlParser(text);

    return (
        <div>
            <div
                className={clsx(styles.root, {
                    [styles.rootFull]: isFullMainComment,
                })}
            >
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
                        {pageUrl ? <a href={`${pageUrl}`}>PageUrl</a> : ''}
                        <p
                            className={clsx(styles.text, {
                                [styles.textFull]: isFullMainComment,
                            })}
                        ></p>

                        <div>{htmlText}</div>
                        {fileImg ? (
                            <img
                                className={`${styles.image} ${isFullSize ? styles.full : ''}`}
                                src={`${mainConfig.CLOUD_DOMAIN_NAME}${fileImg}`}
                                alt={fileImg}
                                onClick={() => setIsFullSize(!isFullSize)}
                            />
                        ) : (
                            ''
                        )}
                        <ul className={styles.mainCommentDetails}>
                            {fileText && (
                                <li onClick={handleDownload}>
                                    <SimCardDownloadIcon /> <span>file.txt</span>
                                </li>
                            )}
                        </ul>
                        {children && <div className={styles.content}>{children}</div>}
                        <ul className={styles.mainCommentDetails}>
                            <li
                                style={{
                                    opacity: `${haveSubcomments ? '1' : '0.5'}`,
                                }}
                                onClick={() => {
                                    if (comments?.length > 0) {
                                        setHaveSubComments((curr) => !curr);
                                    }
                                }}
                            >
                                <p>Комментарі</p>
                                <CommentIcon />
                                {!!comments?.length ? <span>{comments.length}</span> : ''}
                            </li>
                            {isAuth && (
                                <li
                                    style={{ opacity: `${isAdding ? '1' : '0.5'}` }}
                                    onClick={() => {
                                        setIsAdding((cuur) => !cuur);
                                    }}
                                >
                                    <p>Додати комментар</p>
                                    <AddCommentIcon />
                                </li>
                            )}
                        </ul>
                    </div>
                    {isAdding && <AddSubComment formId={'form' + id} mainCommentId={id} />}
                </div>
                {haveSubcomments &&
                    comments.map((comment) => (
                        <div key={comment.id}>
                            <SubComment
                                dispatch={dispatch}
                                comment={comment}
                                isEditable={comment.userId === isAuth?.data.id}
                            />
                        </div>
                    ))}
            </div>
        </div>
    );
};
