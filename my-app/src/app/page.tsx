import { auth } from "@/auth"
import EditRoleAndPhonePage from "@/components/EditRoleAndPhonePage";
import connectDB from "@/lib/db";
import UserModel from "@/models/user.model";
import { redirect } from "next/navigation";

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
  return (
    <div>
      hello
    </div>
  )
}

export default page
