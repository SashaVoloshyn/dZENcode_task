import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {fetchMainCommentsUserName, getPage} from "../../redux/slices/mainComments";
import {MainComment} from "../../components";
import {useSearchParams} from "react-router-dom";
import Paginator from "../../components/Paginator/Paginator";

const MainCommentsPageUserName = () => {
    const dispatch = useDispatch()
    const { mainComments } = useSelector((state) => state.mainComments)

    const [searchParams, setSearchParams] = useSearchParams();

    const isMainCommentsLoading = mainComments.status === 'loading'

    const isMainCommentsError = mainComments.status === 'error'

    React.useEffect(() => {
        if (!searchParams.get('page') || searchParams.get('page') <=0 ) {
            setSearchParams({page: '1'})
        }

        const page = searchParams.get('page');

        dispatch(getPage({page}));

        dispatch(fetchMainCommentsUserName(page))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams,mainComments.item])

    const isAuth = useSelector((state) => state.auth.data)
    return (
        <>
            {(isMainCommentsLoading || isMainCommentsError
                    ? [...Array(5)]
                    : mainComments.items[0]
            ).map((obj, index) =>
                isMainCommentsLoading || isMainCommentsError ? (
                    <MainComment key={index} isLoading={true} />
                ) : (
                    <MainComment
                        dispatch={dispatch}
                        key={index}
                        pageUrl={obj.pageUrl}
                        fileImg={obj.fileImg}
                        id={obj.id}
                        text={obj.text}
                        user={obj.user}
                        created_at={obj.created_at}
                        comments={obj.comments}
                        isEditable={obj.user.id === isAuth?.data.id}
                        isAuth={isAuth}
                    />
                )
            )}
            <Paginator/>
        </>
    )
};

export default MainCommentsPageUserName;