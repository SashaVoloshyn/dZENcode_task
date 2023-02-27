import React, { useState } from 'react'
import clsx from 'clsx'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Clear'
import EditIcon from '@mui/icons-material/Edit'
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'

import styles from './MainComment.module.scss'
import { UserInfo } from '../UserInfo'
import { MainCommentSkeleton } from './Skeleton'
import {mainConfig} from "../../configs/main.config";

export const MainComment = ({
    id,
    text,
    created_at,
    fileImg,
    pageUrl,
    comments,
    user,
    fileText,
    commentsCount,
    children,
    isFullMainComment,
    isLoading,
    isEditable
}) => {
    if (isLoading) {
        return <MainCommentSkeleton />
    }

    const onClickRemove = () => {}

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isCommented, setIsCommented] = useState(false)

    return (
        <div className={clsx(styles.root, { [styles.rootFull]: isFullMainComment })}>
            {isEditable && (
                <div className={styles.editButtons}>
                    <a href={`/MainComments/${id}/edit`}>
                        <IconButton color="primary">
                            <EditIcon />
                        </IconButton>
                    </a>
                    <IconButton onClick={onClickRemove} color="secondary">
                        <DeleteIcon />
                    </IconButton>
                </div>
            )}
            <div className={styles.wrapper}>
                <UserInfo {...user} additionalText={created_at} />
                <div className={styles.indention}>
                    {pageUrl ? <a href={`${pageUrl}`}>PageUrl</a> :''}
                    <p

                        className={clsx(styles.text, {
                            [styles.textFull]: isFullMainComment
                        })}
                    >
                        {isFullMainComment ? (
                            text
                        ) : (
                            <a href={`/MainComments/${id}`}>{text}</a>
                        )}
                    </p>
                    {fileImg ? <img  src={`${mainConfig.CLOUD_DOMAIN_NAME}${fileImg}`} alt={fileImg} />
                        : ''}
                    {children && (
                        <div className={styles.content}>{children}</div>
                    )}
                    <ul className={styles.mainCommentDetails}>
                        <li>
                            <CommentIcon
                                onClick={() =>
                                    setIsCommented((zxc) => !zxc)
                                }
                            />
                            <span>{commentsCount}</span>
                        </li>
                        <li>
                            <CommentIcon />
                        </li>
                    </ul>
                    {isCommented && <div>subcommet</div>}
                </div>
            </div>
        </div>
    )
}
