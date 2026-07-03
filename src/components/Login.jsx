import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, ShieldCheck, Laptop } from "lucide-react";
import { useState } from "react";

export default function Login({
    user,
    setUser,
    password,
    setPassword,
    handleLogin,
    PRESET_USERS,
    newDevice,
    deviceName,
    setDeviceName,
    registerDevice
}) {

    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="login-wrapper">

            <motion.div
                className="login-glow"
                animate={{
                    rotate: 360
                }}
                transition={{
                    repeat: Infinity,
                    duration: 20,
                    ease: "linear"
                }}
            />

            <motion.div
                initial={{
                    opacity: 0,
                    y: 80
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                transition={{
                    type:"spring",

              stiffness:90,

              damping:18
                              }}
                className="login-card"
            >

                <motion.div
                    initial={{
                        scale: .8,
                        opacity: 0
                    }}
                    animate={{
                        scale: 1,
                        opacity: 1
                    }}
                    transition={{
                        delay: .2
                    }}
                    className="logo-circle"
                >
                    <Mail size={34}/>
                </motion.div>

                <h1>SoulMatrix Mail</h1>

                <p>
                    Secure internal mailing dashboard
                </p>

                <form
                    onSubmit={handleLogin}
                    className="login-form"
                >

                    <div className="input-group">

                        <label>User</label>

                        <select
                            value={user}
                            onChange={(e)=>setUser(e.target.value)}
                        >

                            <option value="">
                                Select user
                            </option>

                            {PRESET_USERS.map(u=>(
                                <option
                                    key={u}
                                    value={u}
                                >
                                    {u}
                                </option>
                            ))}

                        </select>

                    </div>

                    {user && user!=="guest" && (

                        <div className="input-group">

                            <label>Password</label>

                            <div className="password-box">

                                <input

                                    type={showPassword ? "text":"password"}

                                    value={password}

                                    onChange={(e)=>setPassword(e.target.value)}

                                    placeholder="Enter password"

                                />

                                <button
                                    type="button"
                                    className="eye-btn"
                                    onClick={()=>setShowPassword(!showPassword)}
                                >

                                    {showPassword
                                        ? <EyeOff size={18}/>
                                        : <Eye size={18}/>
                                    }

                                </button>

                            </div>

                        </div>

                    )}

                    <motion.button

                        whileHover={{
                            scale:1.03
                        }}

                        whileTap={{
                            scale:.97
                        }}

                        className="login-btn"

                    >

                        <ShieldCheck size={18}/>

                        Sign In

                    </motion.button>

                </form>

            </motion.div>

            {newDevice && (

                <motion.div

                    initial={{
                        opacity:0,
                        scale:.9
                    }}

                    animate={{
                        opacity:1,
                        scale:1
                    }}

                    className="device-modal"

                >

                    <Laptop size={36}/>

                    <h3>New Device</h3>

                    <p>
                        Register this device for future logins.
                    </p>

                    <input

                        value={deviceName}

                        placeholder="My Laptop"

                        onChange={(e)=>setDeviceName(e.target.value)}

                    />

                    <button

                        onClick={registerDevice}

                        className="register-btn"

                    >

                        Register Device

                    </button>

                </motion.div>

            )}

        </div>
    );
}