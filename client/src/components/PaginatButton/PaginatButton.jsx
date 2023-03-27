import { Link, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';

const PaginatButton = ({ to, state, isNav = false, children, ...props }) => {
    const { search } = useLocation();
    return (
        <Link to={to} state={state} {...props}>
            <Button className={isNav && search === to ? 'active' : ''}>{children}</Button>
        </Link>
    );
};

export { PaginatButton };
