import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMainComments } from '../../redux/slices/mainComments'
import { MainComment } from '../../components'

const MainCommentsPage = () => {
    const dispatch = useDispatch()
    const { mainComments } = useSelector((state) => state.mainComments)

    const isMainCommentsLoading = mainComments.status === 'loading'
    const isMainCommentsError = mainComments.status === 'error'

    React.useEffect(() => {
        dispatch(fetchMainComments())
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
        </>
    )
}

export default MainCommentsPage
