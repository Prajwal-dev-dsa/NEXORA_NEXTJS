import { auth } from "@/auth"
import EditRoleAndPhonePage from "@/components/EditRoleAndPhonePage";
import connectDB from "@/lib/db";
import UserModel from "@/models/user.model";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";
import UserDashboard from "@/components/user/UserDashboard";
import AdminDashboard from "@/components/admin/AdminDashboard";
import VendorDashboard from "@/components/vendor/VendorDashboard";
import DeliveryGuyDashboard from "@/components/delivery/DeliveryGuyDashboard";

async function page() {
  const session = await auth()
  console.log(session?.user)
  await connectDB();
  const user = await UserModel.findOne({ email: session?.user?.email });
  if (!user) redirect("/login");
  if (!user?.phone && user?.role === "user") {
    return (
      <>
        <EditRoleAndPhonePage />
      </>
    );
  }
  const plainUser = JSON.parse(JSON.stringify(user));
  return (
    <>
      <Navbar user={plainUser} />
      {plainUser.role === "user" && <UserDashboard />}
      {plainUser.role === "admin" && <AdminDashboard />}
      {plainUser.role === "vendor" && <VendorDashboard />}
      {plainUser.role === "deliveryGuy" && <DeliveryGuyDashboard />}
    </>
  )
}

export default page
