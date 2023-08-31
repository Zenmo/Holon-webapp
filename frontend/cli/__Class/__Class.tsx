import { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { basePageWrap } from '../BasePage';
import styles from './__Class.module.css';

class __Class extends PureComponent {
    state = {};

    render() {
        return <div className={styles['__Class']}>__Class</div>;
    }
}

export default basePageWrap(__Class);
