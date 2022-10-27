import { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { Formik, Form } from "formik";
import { Dialog, Transition } from "@headlessui/react";
import { CakeIcon, MailOpenIcon, XIcon } from "@heroicons/react/outline";
import Input from "@/components/Input/Input";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const SignInSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email("Invalid email")
    .required("This field is required"),
});

const UserAndPassSchema = Yup.object().shape({
  email: Yup.string().trim().required("Username is required"),
  password: Yup.string().trim().required("Password is Required"),
});

const Confirm = ({ show = false, email = "" }) => (
  <Transition appear show={show} as={Fragment}>
    <div className="fixed inset-0 z-50">
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-white" />
      </Transition.Child>

      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="flex items-center justify-center h-full p-8">
          <div className="overflow-hidden transition-all transform">
            <h3 className="text-lg font-medium leading-6 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <MailOpenIcon className="w-12 h-12 shrink-0 text-rose-500" />
              </div>
              <p className="mt-2 text-2xl font-semibold">Confirm your email</p>
            </h3>

            <p className="mt-4 text-lg text-center">
              We emailed a magic link to <strong>{email ?? ""}</strong>.
              <br />
              Check your inbox and click the link in the email to login or sign
              up.
            </p>
          </div>
        </div>
      </Transition.Child>
    </div>
  </Transition>
);

const AuthModal = ({ show = false, onClose = () => null }) => {
  const [disabled, setDisabled] = useState(false);
  const [showConfirm, setConfirm] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const router = useRouter();
  const supabaseClient = useSupabaseClient();

  const signInWithEmail = async ({ email }) => {
    let toastId;
    try {
      toastId = toast.loading("Loading...");
      setDisabled(true);

      const { error } = await supabaseClient.auth.signInWithOtp({ email });

      if (error) {
        throw new Error(error.message);
      }
      setConfirm(true);
      toast.dismiss(toastId);
    } catch (err) {
      toast.error("Unable to sign in", { id: toastId });
    } finally {
      setDisabled(false);
    }
  };

  const signInWithUserAndPass = async ({ email, password }) => {
    let toastId;
    try {
      toastId = toast.loading("Loading...");
      setDisabled(true);

      if (showSignIn) {
        const { error } = await supabaseClient.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast.error(toastId);
        } else {
          router.reload();
        }
      } else {
        const { error } = await supabaseClient.auth.signUp({
          email,
          password,
        });
        if (error) {
          toast.error(toastId);
        } else {
          router.reload();
        }
      }
    } catch (err) {
      toast.error("Unable to sign in", { id: toastId });
    } finally {
      setDisabled(false);
    }
  };

  const handleOAuth = async (provider) => {
    toast.loading("Redirecting...");
    setDisabled(true);

    await supabaseClient.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: "/",
      },
    });
  };

  const closeModal = () => {
    if (typeof onClose === "function") {
      onClose();
    }
  };

  // Reset modal
  useEffect(() => {
    if (!show) {
      // Wait for 200ms for aniamtion to finish
      setTimeout(() => {
        setDisabled(false);

        setShowSignIn(false);
      }, 200);
    }
  }, [show]);

  // Remove pending toasts if any
  useEffect(() => {
    toast.dismiss();
  }, []);

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={closeModal}
      >
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-75" />

        <div className="min-h-screen text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="relative inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl sm:rounded-md">
              {/* Close icon */}
              <button
                id="closeModal"
                onClick={closeModal}
                className="absolute p-1 transition rounded-md top-2 right-2 shrink-0 hover:bg-gray-100 focus:outline-none"
              >
                <XIcon className="w-5 h-5" />
              </button>

              <div className="py-12">
                <div className="px-4 sm:px-12">
                  <div className="flex justify-center">
                    <Link href="/">
                      <a className="flex items-center space-x-1">
                        <CakeIcon className="w-8 h-8 shrink-0 text-rose-500" />
                        <span
                          className="text-xl font-semibold tracking-wide"
                          data-testid="favoriteFoodsLogo"
                        >
                          Favorite<span className="text-rose-500">Foods</span>
                        </span>
                      </a>
                    </Link>
                  </div>

                  <Dialog.Title
                    as="h3"
                    className="mt-6 text-lg font-bold text-center sm:text-2xl"
                  >
                    {showSignIn ? "Welcome back!" : "Create your account"}
                  </Dialog.Title>

                  {!showSignIn ? (
                    <Dialog.Description className="mt-2 text-base text-center text-gray-500">
                      Please create an account to list your Favorite Foods and
                      bookmark your favorite ones.
                    </Dialog.Description>
                  ) : null}

                  <div className="mt-10">
                    {/* Sign with Google */}
                    <button
                      id="googleButton"
                      disabled={disabled}
                      onClick={() => handleOAuth("google")}
                      className="h-[46px] w-full mx-auto border rounded-md p-2 flex justify-center items-center space-x-2 text-gray-500 hover:text-gray-600 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-500 disabled:hover:bg-transparent disabled:hover:border-gray-200 transition-colors"
                    >
                      <Image
                        src="/google.svg"
                        alt="Google"
                        width={32}
                        height={32}
                      />
                      <span data-testid="google">
                        Sign {showSignIn ? "in" : "up"} with Google
                      </span>
                    </button>

                    <button
                      id="githubButton"
                      disabled={disabled}
                      onClick={() => handleOAuth("github")}
                      className="mt-1 h-[46px] w-full mx-auto border rounded-md p-2 flex justify-center items-center space-x-2 text-gray-500 hover:text-gray-600 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-500 disabled:hover:bg-transparent disabled:hover:border-gray-200 transition-colors"
                    >
                      <Image
                        src="/github.svg"
                        alt="Github"
                        width={32}
                        height={32}
                      />
                      <span data-testid="github">
                        Sign {showSignIn ? "in" : "up"} with Github
                      </span>
                    </button>

                    <button
                      id="facebookButton"
                      disabled={disabled}
                      onClick={() => handleOAuth("facebook")}
                      className="mt-1 h-[46px] w-full mx-auto border rounded-md p-2 flex justify-center items-center space-x-2 text-gray-500 hover:text-gray-600 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-500 disabled:hover:bg-transparent disabled:hover:border-gray-200 transition-colors"
                    >
                      <Image
                        src="/facebook.svg"
                        alt="Facebook"
                        width={32}
                        height={32}
                      />
                      <span data-testid="facebook">
                        Sign {showSignIn ? "in" : "up"} with Facebook
                      </span>
                    </button>
                    {/* Sign with email */}
                    <Formik
                      initialValues={{ email: "" }}
                      validationSchema={SignInSchema}
                      validateOnBlur={false}
                      onSubmit={signInWithEmail}
                    >
                      {({ isSubmitting, isValid, values }) => (
                        <Form className="mt-4">
                          <Input
                            name="email"
                            type="email"
                            placeholder="Email"
                            disabled={disabled}
                            spellCheck={false}
                            data-testid="emailInput"
                          />

                          <button
                            type="submit"
                            disabled={disabled || !isValid}
                            className="w-full px-8 py-2 mt-6 text-white transition rounded-md bg-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-600 focus:ring-opacity-50 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-rose-600"
                          >
                            {isSubmitting ? "Loading..." : "Send Email"}
                          </button>

                          {!showSignIn && (
                            <p className="mt-2 text-sm text-center text-gray-500"></p>
                          )}

                          <Confirm
                            show={showConfirm}
                            email={values?.email ?? ""}
                          />
                        </Form>
                      )}
                    </Formik>

                    {/* Sign with user and pass */}

                    <Formik
                      initialValues={{ email: "", password: "" }}
                      validationSchema={UserAndPassSchema}
                      validateOnBlur={false}
                      onSubmit={signInWithUserAndPass}
                    >
                      {({ isSubmitting, isValid, values, resetForm }) => (
                        <Form className="mt-10">
                          <Input
                            name="email"
                            type="text"
                            placeholder="Email"
                            disabled={disabled}
                            spellCheck={false}
                            data-testid="usernameInput"
                            id="usernameInput"
                          />

                          <Input
                            name="password"
                            type="password"
                            placeholder="Password"
                            disabled={disabled}
                            spellCheck={false}
                            className="mt-1"
                            data-testid="passwordInput"
                            id="passwordInput"
                          />

                          <button
                            type="submit"
                            disabled={disabled || !isValid}
                            className="w-full px-8 py-2 mt-6 text-white transition rounded-md bg-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-600 focus:ring-opacity-50 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-rose-600"
                            data-testid="signInButton"
                            id="signInButton"
                          >
                            {isSubmitting
                              ? "Loading..."
                              : `Sign ${showSignIn ? "in" : "up"}`}
                          </button>

                          <p className="mt-2 text-sm text-center text-gray-500">
                            {showSignIn ? (
                              <>
                                Don&apos;t have an account yet?{" "}
                                <button
                                  type="button"
                                  disabled={disabled}
                                  onClick={() => {
                                    setShowSignIn(false);
                                    resetForm();
                                  }}
                                  className="font-semibold underline underline-offset-1 text-rose-500 hover:text-rose-600 disabled:hover:text-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Sign up
                                </button>
                                .
                              </>
                            ) : (
                              <>
                                Already have an account?{" "}
                                <button
                                  id="changeToLogin"
                                  type="button"
                                  disabled={disabled}
                                  onClick={() => {
                                    setShowSignIn(true);
                                    resetForm();
                                  }}
                                  className="font-semibold underline underline-offset-1 text-rose-500 hover:text-rose-600 disabled:hover:text-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Log in
                                </button>
                                .
                              </>
                            )}
                          </p>

                          <Confirm
                            show={showConfirm}
                            email={values?.email ?? ""}
                          />
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

AuthModal.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
};

export default AuthModal;
