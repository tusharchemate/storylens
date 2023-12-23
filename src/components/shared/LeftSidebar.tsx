import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";
import { NavLink } from "react-router-dom";

const LeftSidebar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount();

  const navigate = useNavigate();

  const { user } = useUserContext();
  const { pathname } = useLocation();

  useEffect(() => {
    if (isSuccess) {
      navigate("/sign-in");
    }
  }, [isSuccess]);

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img src="/assets/logo.png" alt="logo" width={40} height={40} />{" "}
          <h2
            style={{ fontFamily: "serif", fontSize: "40px", fontWeight: 600 }}
          >
            Storylens
          </h2>
        </Link>

        <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
          <img src={user.imageUrl} alt="image" className="h-14 w-14 rounded" />
          <div className="flex flex-col">
            <p className="body-bold">{user.name}</p>

            <p className="small-regular text-light-3">{user.username}</p>
          </div>
        </Link>

        <ul className="flex flex-col gap-6">
          {sidebarLinks?.map((link: INavLink) => {
            const isActive = pathname == link.route;
            return (
              <li
                key={link.label}
                className={` leftsidebar-link group ${
                  isActive && "bg-primary-500"
                }`}
              >
                <NavLink
                  to={link.route}
                  className="flex gap-5 items-center p-4"
                >
                  <img
                    src={link.imgURL}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  ></img>
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      <Button
        variant="ghost"
        className="shad-button_ghost"
        onClick={() => signOut()}
      >
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
};

export default LeftSidebar;
