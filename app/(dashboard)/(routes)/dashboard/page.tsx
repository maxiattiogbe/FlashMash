import { UserButton } from "@clerk/nextjs";

const DashboardPage = () => {
    return (
        <div>
            <p>Dashboard Page (Protected)</p>
            <UserButton />
        </div>
    )
}

export default DashboardPage;