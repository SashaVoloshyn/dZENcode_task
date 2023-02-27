import React from "react";
import { useDispatch, useSelector } from "react-redux";

import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Grid from '@mui/material/Grid'

import axios from "../axios";

import { MainComment } from '../components'
import { CommentsBlock } from '../components'
import { fetchMainComments } from "../redux/slices/mainComments";

export const Home = () => {
  const dispatch = useDispatch();
  const {mainComments} = useSelector(state => state.mainComments);

  const isMainCommentsLoading = mainComments.status === "loading";

  React.useEffect(() => {

    dispatch(fetchMainComments());


  }, []);

  console.log(mainComments.items[0]);


    return (
        <>
            <Tabs
                style={{ marginBottom: 15 }}
                value={0}
                aria-label="basic tabs example"
            >
                <Tab label="Новые" />
                <Tab label="Популярные" />
            </Tabs>
            <Grid container spacing={4} padding={2}>
                <Grid xs={12} item>
                    {(isMainCommentsLoading ? [...Array(5)] : mainComments.items[0]).map((obj,index) =>
                      isMainCommentsLoading ?(
                        <MainComment key={index} isLoading={true}/>
                        ):(
                        <MainComment
                            key={index}
                            id={obj.id}
                            text={obj.text}
                            imageUrl="https://res.cloudinary.com/practicaldev/image/fetch/s--UnAfrEG8--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/icohm5g0axh9wjmu4oc3.png"
                            user={obj.user}
                            created_at={obj.created_at}

                            commentsCount={3}
                            isEditable
                        />
                      ),
                    )}
                </Grid>
            </Grid>
        </>
    )
}