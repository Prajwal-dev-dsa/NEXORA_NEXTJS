"use client"
import HeroSection from "./HeroSection";
import CategorySlider from "./CategorySlider";
import Products from "./Products";
import Shops from "./Shops";

function UserDashboard() {
  return (
    <div>
      <HeroSection />
      <CategorySlider />
      <Products />
      <Shops />
    </div>
  )
}

export default UserDashboard