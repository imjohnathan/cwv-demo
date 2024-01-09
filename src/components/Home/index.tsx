import "firebase/firestore";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { appStore } from "../../AppStore";
import ActivityModal from "../../components/ModalDetail";
import { Admin, CartItem, LikeItem } from "../../type";
import ActivityCard from "../AdminCard";
import Carousal from "./Carousel";
import HeroHeader from "./HeroHeader";

const Home: React.FC = observer(() => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [likeItems, setLikeItems] = useState<LikeItem[]>([]);

  const handleAdminClick = (admin: any) => {
    setSelectedAdmin(admin);
    toggleModal();
  };

  useEffect(() => {
    appStore.fetchAdmin();

    const userEmail = appStore.currentUserEmail;
    if (userEmail) {
      appStore.fetchLike(userEmail).then((likedItems) => {
        const updatedAdmins = appStore.admins.map((admin) => {
          const isLiked = likedItems.some((item: any) => item.id === admin.id);
          return { ...admin, isLiked };
        });

        appStore.setAdmins(updatedAdmins);
      });
    }
  }, [appStore.currentUserEmail]);

  const handleSignUp = () => {
    if (selectedAdmin && quantity > 0) {
      const cartItem: CartItem = {
        name: selectedAdmin.name,
        quantity: quantity,
        price: selectedAdmin.price,
        id: selectedAdmin.id,
        latitude: selectedAdmin.latitude,
        longitude: selectedAdmin.longitude,
      };
      const userEmail = appStore.currentUserEmail;
      if (userEmail) {
        appStore.newCart(userEmail, cartItem);
        toast.success("加入訂單成功！");
      } else {
        toast.error("用戶未登入");
      }
    } else {
      toast.error("請選擇數量");
    }
  };

  const handleAddToLike = (admin: Admin) => {
    const likeItem: LikeItem = {
      id: admin.id,
      name: admin.name,
      images: admin.images,
      position: admin.place,
      price: admin.price,
      startTime: admin.startTime,
      endTime: admin.endTime,
    };
    const userEmail = appStore.currentUserEmail;
    if (userEmail) {
      appStore.newLike(userEmail, likeItem);
      toast.success("加入收藏成功！");
    } else {
      toast.error("用戶未登入");
    }
  };

  function deleteItem(admin: Admin) {
    if (appStore.currentUserEmail) {
      const newLikeItems = likeItems.filter((item) => item.id !== admin.id);
      setLikeItems(newLikeItems);
      appStore.deleteFromLike(appStore.currentUserEmail, admin.id);
      toast.success("取消收藏");
    }
  }

  const handleIconClick = (admin: Admin) => {
    const updatedAdmins = appStore.admins.map((a) => {
      if (a.id === admin.id) {
        if (a.isLiked) {
          deleteItem(admin);
        } else {
          handleAddToLike(admin);
        }
        return { ...a, isLiked: !a.isLiked };
      }
      return a;
    });
    appStore.setAdmins(updatedAdmins);
  };
  const getGoogleMapsLink = (latitude: string, longitude: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  };

  return (
    <div className="relative overflow-x-hidden pb-10 pt-20">
      <div className="">
        <HeroHeader />
      </div>
      <div style={{'--url': 'url("/lat.png")'}} className="w-full bg-white bg-[var(--url)] bg-contain py-10  md:bg-no-repeat">
        <div className="mb-30 transition mx-auto flex h-auto  justify-center duration-300 hover:scale-105 sm:px-4  md:px-20">
          <Carousal />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 bg-stone-200 py-20 sm:grid-cols-1 sm:px-16  md:grid-cols-2 md:px-20 lg:grid-cols-3 lg:px-12 xl:grid-cols-4 xl:px-40">
        {appStore.admins.map((admin: Admin, index) => (
          <ActivityCard
            key={index}
            admin={admin}
            handleAdminClick={handleAdminClick}
            handleIconClick={handleIconClick}
            getGoogleMapsLink={getGoogleMapsLink}
          />
        )).slice(0, 6)}

{appStore.admins.map((admin: Admin, index) => (
          <ActivityCard
            key={index}
            admin={admin}
            handleAdminClick={handleAdminClick}
            handleIconClick={handleIconClick}
            getGoogleMapsLink={getGoogleMapsLink}
          />
        )).slice(0, 6)}

      </div>
      {isModalOpen && (
          <div className="background-cover " onClick={toggleModal}></div>
        )}
        {isModalOpen && selectedAdmin && (
          <ActivityModal
            isOpen={isModalOpen}
            toggleModal={toggleModal}
            selectedAdmin={selectedAdmin}
            quantity={quantity}
            setQuantity={setQuantity}
            handleSignUp={handleSignUp}
          />
        )}
      <div className="py-10">
        {/* <Calendar /> */}
      </div>
    </div>
  );
});

export default Home;
