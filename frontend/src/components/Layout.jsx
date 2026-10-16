import {styles} from "../assets/dummyStyles";
import Navbar from "./Navbar";
const Layout = ({onlogout, user}) => {
  return (
    <div className={styles.Layout.root}>
      <Navbar user={user} onlogout={onlogout}/>

     
    </div>
    
  )
}

export default Layout