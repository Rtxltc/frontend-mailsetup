import Navbar from "./Navbar";
import StatsCards from "./StatsCards";

export default function Dashboard({
    user,
    children,
    onLogout
}) {

    return (

        <>

            <Navbar
                user={user}
                onLogout={onLogout}
            />
            <main className="dashboard">

                <StatsCards />

                {children}

            </main>

        </>

    );

}