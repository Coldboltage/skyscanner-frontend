import Header from "./Header"
import Footer from "./Footer"
import {useEffect} from "react"
import { useUser } from "@auth0/nextjs-auth0";
import style from "../styles/Layout.module.css"


const Layout = ({children}) => {
  const { user, error, isLoading } = useUser();

if (isLoading === true) {
  return <div className={style.layout}></div>
} else {
  return (
    <>
      <Header/>
      {children}
      <Footer/>
    </>
  )
}

  
}

export default Layout