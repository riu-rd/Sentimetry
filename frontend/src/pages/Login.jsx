import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import "../tailwind.css"; // Import Tailwind CSS file

const Login = () => {
    // Check if user is already authenticated
    const navigate = useNavigate();

    // Declarations
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState('')

    // When credential values change
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    // When log in button is clicked
    const handleLogin = async (e) => {
        e.preventDefault();

        const auth = getAuth();
        try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
        );

        const userEmail = userCredential.user.email;
        alert(`Successfully Logged in: ${userEmail}`);

        // Redirect to "/home" after successful login
        navigate("/home");
        } catch (error) {
        alert("Error Logging In");
        console.error(error);
        }
    };

    const resetPassword = (email) => {
        const auth = getAuth();
        sendPasswordResetEmail(auth, email)
        .then(() => {
            alert('Password reset email sent!')
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode + " " + errorMessage)
        });
    }

    const handleForgotPasswordSubmit = () => {
        setShowModal(false)
        resetPassword(email)
    }

  return (
    <section className="flex flex-col lg:flex-row items-center justify-center lg:h-screen">
        <div>
            {showModal ? (
                <>
                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="relative w-auto my-6 mx-auto max-w-3xl">
                        {/*content*/}
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            {/*header*/}
                            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                <h3 className="text-3xl font-semibold text-black">
                                    Reset Password
                                </h3>
                                <button
                                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                    onClick={() => setShowModal(false)}
                                >
                                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none"> × </span>
                                </button>
                            </div>
                            {/*body*/}
                            <div className="relative p-6 flex-auto text-black space-y-3">
                                <h1 className="text-xl">Enter your email:</h1>
                                <input type="email" className="rounded-lg bg-slate-200 w-96 p-2" onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                            {/*footer*/}
                            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                <button
                                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                >
                                    Close
                                </button>
                                <button
                                    className="bg-yellow-500 text-white active:bg-yellow-500 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => handleForgotPasswordSubmit()}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </div>

        <div>
            <div className="text-center text-main-yellow">
                <h1 className="drop-shadow-xl text-9xl century-gothic font-extrabold mx-8 my-4 mt-">
                SentiMetry
                </h1>
                <h2 className="drop-shadow-xl linden-hill-regular text-2xl text-white">
                Navigate Your Inner Landscape, One Entry at a Time
                </h2>
            </div>
            <div className="form-container bg-white rounded-3xl shadow-lg p-10 mt-8 sm:w-96 lg:w-full">
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <div>
                            <label
                                className="text-xl century-gothic font-bold text-black"
                                htmlFor="firstName"
                                >
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your Email"
                                name="email"
                                value={credentials.email}
                                onChange={handleChange}
                                required
                                className="form-input rounded-xl w-full text-black"
                            />
                        </div>
                        <div>
                            <label
                                className="text-xl century-gothic font-bold text-black"
                                htmlFor="firstName"
                                >
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter your Password"
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                                className="form-input rounded-xl w-full mb-0 text-black"
                            />
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center gap-1 ">
                        <button
                            type="submit"
                            className="text-2xl p-2 form-button rounded-xl bg-main-yellow hover:bg-yellow-500 w-full mt-4 mb-2">
                            Login
                        </button>
                        <div className="flex m-0 space-x-20">
                            <button className="bg-transparent text-blue-500 m-0 hover:underline underline-offset-2" onClick={() => setShowModal(true)}>
                                Forgot Password?
                            </button>
                            <button className="bg-transparent text-blue-500 m-0 hover:underline underline-offset-2" onClick={() => navigate('/register')}>
                                Don't have an account?
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        
    </section>
  );
};

export default Login;
