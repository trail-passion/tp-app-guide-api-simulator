import * as React from 'react'
import User from '../../service/service/user'
import Service from '../../service/service'

export function useCurrentUser() {
    const [user, setUser] = React.useState<User | null>(Service.user)
    React.useEffect(() => {
        Service.eventUserChange.add(setUser)
        return () => Service.eventUserChange.remove(setUser)
    }, [])
    return user
}
