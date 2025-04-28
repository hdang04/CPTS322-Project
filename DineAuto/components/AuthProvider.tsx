import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { AppState } from "react-native";


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

            if (session) {
                const {data} = await supabase.from('users').select('*').eq('id', session.user.id).single()
                setUser(data || null) 
                setIsAdmin(data.role === "ADMIN")
            }

            setSession(session)

            setLoading(false)
        }
        
        fetchSession()

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            fetchSession()  
            setSession(session);
          });

        const appStateListener = AppState.addEventListener("change", (state) => {
            if (state === "active") {
                supabase.auth.startAutoRefresh();
            } else {
                supabase.auth.stopAutoRefresh();
            }
        });

        return () => {
            authListener?.subscription?.unsubscribe();
            appStateListener.remove();
          };


    }, [])

    console.log(user)

    return (
        <AuthContext.Provider value={{session, loading, user, isAdmin}}>
            {children}
        </AuthContext.Provider>
    )
}