import React from 'react'

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import PostAddIcon from '@mui/icons-material/PostAdd'
import { Button, Grid, TextField } from '@mui/material'

const AddSubCommentBtns = () => {
    return (
        <>
            <li className="upload">
                <AddPhotoAlternateIcon />
            </li>

            <li className="upload">
                <PostAddIcon />
            </li>
        </>
    )
}

const AddSubComment = () => {
    return (
        <form>
            <Grid
                container
                style={{
                    display: 'flex',
                    width: 'calc(100% - 36px)',
                    marginLeft: '30px',
                    padding: '12px 0 6px 0'
                }}
            >
                <Grid item xs={10}>
                    <TextField
                        multiline
                        fullWidth
                        type="text"
                        placeholder="Reply"
                    />
                </Grid>
                <Grid item xs={2}>
                    <Button
                        variant="contained"
                        style={{
                            marginLeft: '5px',
                            height: '100%'
                        }}
                    >
                        Reply
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export { AddSubComment, AddSubCommentBtns }
