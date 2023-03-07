import { IconButton } from '@mui/material'
import clsx from 'clsx'
import React from 'react'
import { UserInfo } from '../UserInfo'
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload'
import DeleteIcon from '@mui/icons-material/Clear'
import EditIcon from '@mui/icons-material/Edit'
import { useSelector } from 'react-redux'
import styles from './SubComment.module.scss'
import { mainConfig } from '../../configs/main.config'

const SubComment = ({
    comment: { created_at, userId, id, text, fileImg, fileText },
    isEditable
}) => {
    const { mainComments } = useSelector((state) => state.mainComments)

    const user = mainComments.items[0].filter(
        (main) => main.user.id === userId
    )[0].user

    return (
        <div className={clsx(styles.root)}>
            {isEditable && (
                <div className={styles.editButtons}>
                    <a href={`/MainComments/${id}/edit`}>
                        <IconButton color="primary">
                            <EditIcon />
                        </IconButton>
                    </a>
                    <IconButton color="secondary">
                        <DeleteIcon />
                    </IconButton>
                </div>
            )}
            <div className={styles.wrapper}>
                <UserInfo {...user} additionalText={created_at} />
                <div className={styles.indention}>
                    <p className={styles.text}>{text}</p>
                </div>
                {fileImg && (
                    <img
                        className={styles.image}
                        src={`${mainConfig.CLOUD_DOMAIN_NAME}${fileImg}`}
                        alt={fileImg}
                    />
                )}
                <ul className={styles.mainCommentDetails}>
                    {fileText && (
                        <li onClick={() => {}}>
                            <SimCardDownloadIcon /> <span>file.txt</span>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default SubComment
