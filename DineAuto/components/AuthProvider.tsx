import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import { createContext, PropsWithChildren, useEffect, useState } from "react";


type AuthData = {
    session: Session | null
    loading: boolean
    user: any
    isAdmin: boolean
}

export const AuthContext = createContext<AuthData>({
    session: null,
    loading: true,
    user: null,
    isAdmin: false,
})  

export default function AuthProvider({children}: PropsWithChildren) {

    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)
  
    useEffect(() => {
        const fetchSession = async() => {
            const { data: {session} } = await supabase.auth.getSession()

            setSession(session)

            if (session) {
                const {data} = await supabase.from('users').select('*').eq('id', session.user.id).single()
                setUser(data || null) 
                setIsAdmin(data.role === "ADMIN")
            }

            setLoading(false)
        }
        
        fetchSession()

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        });
    
        // Cleanup on component unmount
        return () => {
            authListener?.subscription.unsubscribe();
        };



    }, [])

    console.log(user)
    console.log(isAdmin) 
    
    return (
        <AuthContext.Provider value={{session, loading, user, isAdmin}}>
            {children}
        </AuthContext.Provider>
    )
}