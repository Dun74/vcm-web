import styles from './Menu.module.css';

const Menu = (props) => {
    return (
        <div className={styles.Menu}>{props.children}</div>
    )
}

export default Menu;