import Header from "./Header"
import Footer from "./Footer"
import {useEffect} from "react"
import { useUser } from '@auth0/nextjs-auth0';

const Layout = ({children}) => {
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    console.log(user)
  }, [isLoading]);

  return (
    <>
      <Header/>
      {children}
      <Footer/>

    </>
  )
}

export default Layout