import Signup from './Signup.jsx'
import auth from '../config/firebase.jsx'

const LoginSignupHub = () => {
    // Add a feature that checks local storage to see if they
    // already have an account before redirecting to Signup.
    console.log(auth?.currentUser?.email)

    return (
        <main>
            <Signup />
        </main>
    )
}

export default LoginSignupHub