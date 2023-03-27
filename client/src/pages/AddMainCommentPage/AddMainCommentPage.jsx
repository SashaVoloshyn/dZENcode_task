import { TextField, Button, Paper, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import styles from './AddmainComment.module.scss';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCreateMainComments } from '../../redux/slices/mainComments';
import { useNavigate } from 'react-router-dom';
import { joiResolver } from '@hookform/resolvers/joi';
import { MainCommentCreateValidator } from '../../utils';
import { mainConfig } from '../../configs/main.config';

export const AddMainCommentPage = () => {
    const [formText, setFormText] = useState('');
    const [clossed, setClossed] = useState('');
    const isAuth = useSelector((state) => state.auth.data);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm({
        mode: 'all',
        resolver: joiResolver(MainCommentCreateValidator),
        shouldUnregister: true,
    });

    const navigate = useNavigate();

    const tags = ['<a href="#"></a>', '<code></code>', '<i></i>', '<strong></strong>'];

    const handleTagClick = (tag) => {
        insertTextAtCursor(tag);
    };

    const insertTextAtCursor = (textToInsert) => {
        const textarea = document.getElementById('myTextArea');
        const cursorPos = textarea.selectionStart;
        const currentText = formText;
        const newText = currentText.substring(0, cursorPos) + textToInsert + currentText.substring(cursorPos);
        setFormText(newText);
    };

    const checkIfTagsClosed = (e) => {
        const text = e.target.value;
        setFormText(text);

        const openingTags = [];
        const closingTags = [];
        const regex = /<\/?(a|code|i|strong)(?:\s+[^>]*|\s*)?>/gi;

        let match;
        while ((match = regex.exec(formText))) {
            if (match[0].startsWith('</')) {
                closingTags.push(match[1]);
            } else {
                openingTags.push(match[1]);
            }
        }

        const unclosedTags = [];
        const tagTypes = ['a', 'code', 'i', 'strong'];
        for (const tagType of tagTypes) {
            const numOpen = openingTags.filter((tag) => tag === tagType).length;
            const numClose = closingTags.filter((tag) => tag === tagType).length;
            if (numOpen > numClose) {
                unclosedTags.push(`<${tagType}>`);
            } else if (numOpen < numClose) {
                unclosedTags.push(`</${tagType}>`);
            }
        }

        if (!!unclosedTags.length) {
            setError('text', { type: 'unclosedTags', message: `Не закритий тег: ${unclosedTags}` });
            setClossed(`Не закритий тег: ${unclosedTags}`);
        } else {
            setClossed('');
        }
    };

    const { userData } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    let userId = undefined;

    if (userData) {
        userId = Number(userData.data.id);
    }

    const recaptchaRef = useRef(null);
    const [captchaToken, setCaptchaToken] = useState(null);

    const handleCaptchaChange = (token) => {
        setCaptchaToken(token);
    };

    const onSubmit = async (data) => {
        if (!errors.text) {
            setClossed('');
        }

        if (!clossed) {
            const formData = new FormData();
            data.fileImg[0] && formData.append('fileImg', data.fileImg[0]);
            data.fileText[0] && formData.append('fileText', data.fileText[0]);
            data.pageUrl && formData.append('pageUrl', data.pageUrl);
            formData.append('text', data.text);
            formData.append('userId', userId);
            formData.append('clientKey', window.localStorage.getItem('clientKey'));

            const mainCommentData = await dispatch(fetchCreateMainComments(formData));

            reset();

            if (typeof mainCommentData.payload === 'string') {
                return alert(mainCommentData.payload);
            } else {
                navigate('/');
            }
        } else {
            return alert(clossed);
        }
    };

    useEffect(() => {}, [isAuth?.data]);

    return (
        <Paper classes={{ root: styles.root }}>
            <Typography classes={{ root: styles.title }} variant="h5">
                Створити комментар
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    error={Boolean(errors.pageUrl?.message)}
                    helperText={errors.pageUrl && <span>{errors.pageUrl?.message}</span>}
                    {...register('pageUrl')}
                    className={styles.field}
                    label="HomePage URL"
                    fullWidth
                />
                <div className={styles.tags}>
                    {tags.map((tag, index) => (
                        <Button className={styles.tag} key={index} onClick={() => handleTagClick(tag)}>
                            {tag}
                        </Button>
                    ))}
                </div>
                <TextField
                    error={Boolean(errors.text?.message)}
                    helperText={errors.text && <span>{errors.text?.message}</span>}
                    {...register('text', { required: 'Напишіть комментар' })}
                    className={styles.field}
                    fullWidth
                    multiline
                    rows={5}
                    label={'Комментар'}
                    id="myTextArea"
                    value={formText}
                    onChange={checkIfTagsClosed}
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

                <ReCAPTCHA sitekey={mainConfig.ReCAPTCHA_KEY} ref={recaptchaRef} onChange={handleCaptchaChange} />
                <div className={styles.submit}>
                    <Button type="submit" disabled={!captchaToken} variant="contained" id="createBtn">
                        Відправити комментар
                    </Button>
                </div>
            </form>
        </Paper>
    );
};
