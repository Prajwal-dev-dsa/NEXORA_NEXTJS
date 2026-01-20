import { auth } from "@/auth"
import EditRoleAndPhonePage from "@/components/EditRoleAndPhonePage";
import connectDB from "@/lib/db";
import UserModel from "@/models/user.model";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";
import UserDashboard from "@/components/user/UserDashboard";
import AdminDashboard from "@/components/admin/AdminDashboard";
import DeliveryGuyDashboard from "@/components/delivery/DeliveryGuyDashboard";
import FillShopDetails from "@/components/vendor/FillShopDetails";
import VendorPage from "@/components/vendor/VendorPage";

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
  if (user?.role === "vendor" && (!user?.shopName || !user?.shopAddress || !user?.gstNumber)) {
    return (
      <>
        <FillShopDetails />
      </>
    );
  }
  const plainUser = JSON.parse(JSON.stringify(user));
  return (
    <>
      <Navbar user={plainUser} />
      {plainUser.role === "user" && <UserDashboard />}
      {plainUser.role === "admin" && <AdminDashboard />}
      {plainUser.role === "vendor" && <VendorPage user={plainUser} />}
      {plainUser.role === "deliveryGuy" && <DeliveryGuyDashboard />}
    </>
  )
}

export default page
