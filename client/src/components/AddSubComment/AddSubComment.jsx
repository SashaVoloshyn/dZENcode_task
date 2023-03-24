import React from 'react'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import PostAddIcon from '@mui/icons-material/PostAdd'
import SendIcon from '@mui/icons-material/Send';
import {Button, Grid, TextField} from '@mui/material'
import './AddSubComment.module.scss'
import {useForm} from "react-hook-form";
import {joiResolver} from "@hookform/resolvers/joi";
import {CommentCreateValidator} from "../../utils";
import {useDispatch, useSelector} from "react-redux";
import {fetchCreateComments} from "../../redux/slices/comments";


const AddSubComment = ({formId,mainCommentId}) => {

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm({
        mode: 'all',
        resolver: joiResolver(CommentCreateValidator)
    })


    const {userData} = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    let userId = undefined

    if (userData) {
        userId = Number(userData.data.id)
    }

    const onSubmit = async (data) => {
            try {
                const formData = new FormData();
                data.fileImg[0] && formData.append('fileImg', data.fileImg[0]);
                data.fileText[0] && formData.append('fileText', data.fileText[0]);
                formData.append('text', data.text);
                formData.append('userId', userId);
                formData.append('mainCommentId',mainCommentId)
                formData.append('clientKey', window.localStorage.getItem('clientKey'));

                const commentData = await dispatch(fetchCreateComments(formData));

                if (!commentData) console.log('errror')

                console.log(commentData);
                reset();

            }catch (e) {
                console.error(e);
            }
    }

    return (
        <form id={formId} onSubmit={handleSubmit(onSubmit)}>
            <Grid
                container
                style={{
                    display: 'flex',
                    rowGap: '10px',
                    alignItems: 'center',
                    width: 'calc(100% - 36px)',
                    marginLeft: '22px',

                }}
            >
                <li className='upload'>
                    <label className='uploadLabel' htmlFor='upload-image'>
                        Додати картинку
                        <AddPhotoAlternateIcon/>
                    </label>

                    <div className='addingFile'>
                        <input
                            type='file'
                            accept='.jpg,.png,.jpeg,.gif'
                            {...register('fileImg')}
                            id='upload-image'
                            defaultValue={null}
                            hidden={true}
                        />
                    </div>
                </li>

                <li className='upload'>
                    <label className='uploadLabel' htmlFor='upload-txt'>
                        Додати файл
                        <PostAddIcon/>
                    </label>
                    <div className='addingFile'>
                        <input
                            {...register('fileText')}
                            form={formId}
                            type='file'
                            defaultValue={null}
                            accept='.txt'
                            id='upload-txt'
                            hidden={true}
                        />
                    </div>
                </li>
                <Grid item xs={10}>
                    <TextField
                        error={Boolean(errors.text?.message)}
                        {...register('text', {required: 'Напишіть комментар'})}
                        multiline
                        fullWidth
                        type='text'
                        placeholder='Написати комментар...'
                        inputProps={{
                            style:{
                                maxHeight: '80px'
                            }
                        }}

                    />
                </Grid>
                <Grid item xs={2}>
                    <Button
                        type='submit'
                        variant='contained'
                        style={{
                            marginLeft: '10px',
                            height: '55px'
                        }}
                    >
                        <SendIcon/>
                    </Button>
                </Grid>
            </Grid>

        </form>
    )
}

export {AddSubComment}
