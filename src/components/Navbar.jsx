import { motion } from "framer-motion";
import {
    Mail,
    Bell,
    Search,
    LogOut,
    UserCircle2
} from "lucide-react";

export default function Navbar({
    user,
    onLogout
})  {
    return (
        <motion.header
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: .45 }}
            className="navbar"
        >
            <div className="nav-left">

                <div className="brand">

                    <Mail size={22} />

                    <span>SoulMatrix Mail</span>

                </div>

                <div className="search-box">

                    <Search size={18} />

                    <input
                        placeholder="Search..."
                    />

                </div>

            </div>

            <div className="nav-right">

                <button className="icon-btn">

                    <Bell size={20} />

                </button>

                <div className="profile">

                    <UserCircle2 size={36} />

                    <div>

                        <strong>{user}</strong>

                        <small>Administrator</small>

                    </div>

                </div>

                <button
                    className="logout"
                    onClick={onLogout}
                >

                    <LogOut size={18} />

                    Logout

                </button>

            </div>

        </motion.header>
    );
}