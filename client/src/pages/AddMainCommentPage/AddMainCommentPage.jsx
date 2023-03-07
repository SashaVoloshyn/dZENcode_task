import { TextField, Button, Paper, Typography } from '@mui/material'
import React, { useState } from 'react'
import styles from './AddmainComment.module.scss'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCreateMainComments } from '../../redux/slices/mainComments'
import { useNavigate } from 'react-router-dom'
export const AddMainCommentPage = () => {
    const [formText, setFormText] = useState('')
    const [helperText, setHelperText] = useState('')

    const navigate = useNavigate()

    const tags = [
        '<a href="#"></a>',
        '<code></code>',
        '<i></i>',
        '<strong></strong>'
    ]

    const handleTagClick = (tag) => {
        insertTextAtCursor(tag)
    }

    const insertTextAtCursor = (textToInsert) => {
        const textarea = document.getElementById('myTextArea')
        const cursorPos = textarea.selectionStart
        const currentText = formText
        const newText =
            currentText.substring(0, cursorPos) +
            textToInsert +
            currentText.substring(cursorPos)
        setFormText(newText)
    }

    const checkIfTagsClosed = () => {
        const openingTags = []
        const closingTags = []
        const regex = /<\/?(a|code|i|strong)(?:\s+[^>]*|\s*)?>/gi

        let match
        while ((match = regex.exec(formText))) {
            if (match[0].startsWith('</')) {
                closingTags.push(match[1])
            } else {
                openingTags.push(match[1])
            }
        }

        const unclosedTags = []
        const tagTypes = ['a', 'code', 'i', 'strong']
        for (const tagType of tagTypes) {
            const numOpen = openingTags.filter((tag) => tag === tagType).length
            const numClose = closingTags.filter((tag) => tag === tagType).length
            if (numOpen > numClose) {
                unclosedTags.push(`<${tagType}>`)
            } else if (numOpen < numClose) {
                unclosedTags.push(`</${tagType}>`)
            }
        }

        if (unclosedTags.length === 0) {
            setHelperText('')
        } else {
            setHelperText(`Unclosed tags detected: ${unclosedTags.join(', ')}`)
        }
    }

    const { register, handleSubmit } = useForm({
        defaultValues: {
            text: ''
        },
        mode: 'onChange'
    })

    const { userData } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    let userId = undefined

    if (userData) {
        userId = userData.data.id
    }

    const onSubmit = async (data) => {
        const formData = new FormData()
        data.fileImg[0] && formData.append('fileImg', data.fileImg[0])
        data.fileText[0] && formData.append('fileText', data.fileText[0])
        data.pageUrl && formData.append('pageUrl', data.pageUrl)
        formData.append('text', data.text)
        formData.append('userId', userId)
        formData.append('clientKey', window.localStorage.getItem('clientKey'))

        const mainCommentData = await dispatch(
            fetchCreateMainComments(formData)
        )

        console.log(mainCommentData)

        if (!mainCommentData.payload) {
            return alert('не вдалось відправити коментар')
        } else {
            navigate('/')
        }
    }

    return (
        <Paper classes={{ root: styles.root }}>
            <Typography classes={{ root: styles.title }} variant="h5">
                Створити комментар
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    {...register('pageUrl')}
                    className={styles.field}
                    label="HomePage page"
                    helperText={''}
                    fullWidth
                />
                <div className={styles.tags}>
                    {tags.map((tag, index) => (
                        <Button
                            className={styles.tag}
                            key={index}
                            onClick={() => handleTagClick(tag)}
                        >
                            {tag}
                        </Button>
                    ))}
                </div>
                <TextField
                    {...register('text')}
                    className={styles.field}
                    fullWidth
                    multiline
                    rows={5}
                    label={'Comment'}
                    helperText={helperText}
                    error={!!helperText}
                    id="myTextArea"
                    value={formText}
                    onChange={(e) => setFormText(e.target.value)}
                />
                <div className={styles.upload}>
                    <label htmlFor="fileImg">Виберіть зображення</label>
                    <input
                        {...register('fileImg')}
                        type="file"
                        accept=".jpg,.png,.jpeg,.gif"
                        defaultValue={null}
                        id="fileImg"
                        hidden={true}
                    />
                    <label htmlFor="fileText">Виберіть .txt файл</label>
                    <input
                        {...register('fileText')}
                        type="file"
                        accept=".txt"
                        defaultValue={null}
                        id="fileText"
                        hidden={true}
                    />
                </div>

                <div>{/*  <LoadCanvasTemplate /> */}</div>
                <TextField
                    className={styles.field}
                    label="CAPTCHA"
                    helperText={''}
                    fullWidth
                />
                <div className={styles.submit}>
                    <Button
                        type="submit"
                        variant="contained"
                        onClick={checkIfTagsClosed}
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </Paper>
    )
}
