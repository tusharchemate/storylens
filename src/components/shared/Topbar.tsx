import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";

const Topbar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount();

  const navigate = useNavigate();

  const { user } = useUserContext();

  useEffect(() => {
    if (isSuccess) {
      navigate("/sign-in");
    }
  }, [isSuccess]);

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/logo.png"
            alt="logo"
            width={35}
            height={35}
          />
        </Link>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={() => signOut()}>
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>

          <Link to={""}>
            {/*  to={`/profile/${user.id}`} */}
            <img src={user.imageUrl} className="h-8 w-8 rounded" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
