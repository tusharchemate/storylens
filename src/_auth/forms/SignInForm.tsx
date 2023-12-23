import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { SignInValidation } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";
import { message } from "antd";

const SignInForm = () => {
  const navigate = useNavigate();
  const { checkAuthUser, isPending: isUserLoading } = useUserContext();

  const { mutateAsync: signInAccount, isPending: isSignIn } =
    useSignInAccount();

  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignin = async (user: z.infer<typeof SignInValidation>) => {
    const session = await signInAccount(user);

    if (!session) {
      message.error("Login failed. Please try again!");
      return;
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();

      navigate("/");
    } else {
      message.error("Login failed. Please try again!");
      return;
    }
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="assets/logo.png" width={50} height={50} />
        <h2 style={{ fontFamily: "serif", fontSize: "50px", fontWeight: 700 }}>
          Storylens
        </h2>
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Create a new account
        </h2>
        <p className="text-light-2 small-medium md:base-regular mt-2">
          To use Story Sphere enter your details
        </p>
        <form
          onSubmit={form.handleSubmit(handleSignin)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="shad-button_primary">
            {isUserLoading || isSignIn ? (
              <div className="flex-center gap-1">
                <Loader /> Loading ...
              </div>
            ) : (
              "Log In"
            )}
          </Button>
          <p className=" text-small-regular text-light-2 text-center mt-2">
            Don't have an account?
            <Link
              className="text-primary-500 text-small-semibold ml-1"
              to="/sign-up"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignInForm;
