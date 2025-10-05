import { Loader } from "@/components/ui/custom/loader";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export  const withAuth = (Component: React.FC) => {
        return (props: any) => {
            const { isAuthenticated } = useAuth()
            const router = useRouter();

            useEffect(() => {
                if(!isAuthenticated){
                    router.push("/authentication/login")
                }
            }, [isAuthenticated, router])

            if(!isAuthenticated){
                return <Loader/>
            }

            return <Component {...props}/>
        }
    }