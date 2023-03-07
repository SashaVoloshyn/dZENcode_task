import React, { useState } from 'react'
import clsx from 'clsx'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Clear'
import EditIcon from '@mui/icons-material/Edit'
import CommentIcon from '@mui/icons-material/Comment'
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload'
import AddCommentIcon from '@mui/icons-material/AddComment'
import ReactHtmlParser from 'html-react-parser'
import { UserInfo } from '../UserInfo'
import { MainCommentSkeleton } from './Skeleton'
import { mainConfig } from '../../configs/main.config'
import styles from './MainComment.module.scss'
import axios from 'axios'
import SubComment from '../SubComment/SubComment'
import {
    AddSubComment,
    AddSubCommentBtns
} from '../AddSubComment/AddSubComment'

export const MainComment = ({
    id,
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
    isEditable
}) => {
    if (isLoading) {
        return <MainCommentSkeleton />
    }
    const onClickRemove = () => {}

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [haveSubcomments, setHaveSubComments] = useState(false)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isAdding, setIsAdding] = useState(false)

    const handleDownload = async (fileLink) => {
        try {
            const response = await axios.get(fileLink)
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'file.txt')
            document.body.appendChild(link)
            link.click()
        } catch (error) {
            console.log(error)
        }
    }

    let test = ReactHtmlParser(text)

    return (
        <div>
            <div
                className={clsx(styles.root, {
                    [styles.rootFull]: isFullMainComment
                })}
            >
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
                        {pageUrl ? <a href={`${pageUrl}`}>PageUrl</a> : ''}
                        <p
                            className={clsx(styles.text, {
                                [styles.textFull]: isFullMainComment
                            })}
                        ></p>

                        <div>{test}</div>
                        {fileImg ? (
                            <img
                                className={styles.image}
                                src={`${mainConfig.CLOUD_DOMAIN_NAME}${fileImg}`}
                                alt={fileImg}
                            />
                        ) : (
                            ''
                        )}
                        {children && (
                            <div className={styles.content}>{children}</div>
                        )}
                        <ul className={styles.mainCommentDetails}>
                            <li
                                style={{
                                    opacity: `${haveSubcomments ? '1' : '0.5'}`
                                }}
                                onClick={() => {
                                    if (comments?.length > 0) {
                                        setHaveSubComments((curr) => !curr)
                                    }
                                }}
                            >
                                <CommentIcon />
                                {!!comments?.length ? (
                                    <span>{comments.length}</span>
                                ) : (
                                    ''
                                )}
                            </li>
                            <li
                                style={{ opacity: `${isAdding ? '1' : '0.5'}` }}
                                onClick={() => {
                                    setIsAdding((cuur) => !cuur)
                                }}
                            >
                                <AddCommentIcon />
                            </li>
                            {!!fileText && (
                                <li
                                    onClick={() => {
                                        handleDownload(
                                            `${mainConfig.CLOUD_DOMAIN_NAME}${fileText}`
                                        )
                                    }}
                                >
                                    <SimCardDownloadIcon />{' '}
                                    <span>file.txt</span>
                                </li>
                            )}
                            {isAdding && <AddSubCommentBtns />}
                        </ul>
                    </div>
                    {isAdding && <AddSubComment />}
                </div>
                {haveSubcomments &&
                    comments.map((comment) => (
                        <div key={comment.id}>
                            <SubComment
                                comment={comment}
                                isEditable={comment.userId === isAuth?.data.id}
                            />
                        </div>
                    ))}
            </div>
        </div>
    )
}
