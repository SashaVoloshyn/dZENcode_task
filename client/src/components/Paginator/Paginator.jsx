import {useSelector} from "react-redux";

import {PaginatButton} from "../PaginatButton/PaginatButton";

const Paginator = () => {
    const { mainComments:{currentPage,itemsCount} } = useSelector((state) => state.mainComments)

    const pagesArr = [];
    const pages = Math.ceil(itemsCount / 25);

    if (pages > 10) {
        if (currentPage > 5 && currentPage<pages) {
            for (let i = Number(currentPage)-4; i < Number(currentPage) + 5; i++) {
                pagesArr.push(i);

                if (i === pages +5 ||i=== pages) break
            }

        }else {
            for (let i = 1; i <= 10; i++) {
                pagesArr.push(i)
                if (i === pages||i===pages) break
            }
        }
    } else {
        for (let i = 1; i <= pages; i++) {
            pagesArr.push(i)
        }
    }


    return (
        <div>
            <div>
                {pagesArr.map(page => <PaginatButton key={page} to={`?page=${page}`} isNav={true}>{page}</PaginatButton>)}
            </div>
            
        </div>
    );
};

export default Paginator;