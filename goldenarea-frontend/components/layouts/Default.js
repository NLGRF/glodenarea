import Topbar from "./reusable/Topbar";
import styles from "./Default.module.css";
export default function Default({ children }) {
  return (
    <div>
      <Topbar></Topbar>
      <div className={styles.container}>{children}</div>
    </div>
  );
}
