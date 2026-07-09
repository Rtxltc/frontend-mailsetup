import Navbar from "./Navbar";
import StatsCards from "./StatsCards";

export default function Dashboard({
    user,
    children,
    onLogout,
    onOpenInbox
}) {

    return (

        <>

            <Navbar
                user={user}
                onLogout={onLogout}
                onOpenInbox={onOpenInbox}
            />
            <main className="dashboard">

                <StatsCards />

                {children}

            </main>

        </>

    );

}