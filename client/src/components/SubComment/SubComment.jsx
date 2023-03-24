import { IconButton } from '@mui/material'
import clsx from 'clsx'
import React from 'react'
import { UserInfo } from '../UserInfo'
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload'
import DeleteIcon from '@mui/icons-material/Clear'
import { useSelector } from 'react-redux'
import styles from './SubComment.module.scss'
import { mainConfig } from '../../configs/main.config'
import {deleteComments} from "../../redux/slices/comments";

const SubComment = ({
    comment: { created_at, user, id, text, fileImg, fileText }, dispatch,
    isEditable
}) => {
    const { mainComments } = useSelector((state) => state.mainComments)
    console.log(mainComments);

    const onClickRemove = async () => {
       try {
           const clientKey = window.localStorage.getItem('clientKey')
           const confirmation = window.confirm('Ви дійсно хочете видалити ваш комментар?')
           if (confirmation) {
               await dispatch(deleteComments({ id, clientKey }))
           }

       }catch (e) {
           console.error(e)
       }
    }




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
                    <p className={styles.created_at}>
                        {created_at.slice(0, 10) + ' ' + created_at.slice(11, 16)}
                    </p>
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
