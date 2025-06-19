"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import Link from "next/link";
import Loading from "@/components/loading/page";
import { signIn } from "next-auth/react";

export default function Main() {
 
  const [loading, setLoading] = useState(true);
  const [mobileInputValue, setMobileInputValue] = useState("");
  const [emailInputValue, setEmailInputValue] = useState("");
  const [passwordInputValue, setPasswordInputValue] = useState("");

  const handleMobileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMobileInputValue(event.target.value);
  };
  const handleEmailInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmailInputValue(event.target.value);
  };
  const handlePasswordInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPasswordInputValue(event.target.value);
  };

  const [mobileOption, setMobileOption] = useState(false);

  let emailContinueDisabled = !(emailInputValue && passwordInputValue);
  let mobileContinueDisabled = !mobileInputValue;

  return (
    <>
      {loading ? (
        <Loading loading={loading} setLoading={setLoading}/>
      ) : (
        <div id="login-page" className="flex flex-col gap-10 mt-36 w-full px-4">
          <section>
            <h1 className="text-3xl text-primary font-semibold mb-3">
              Welcome Back!
            </h1>
            {mobileOption ? (
              <p className="text-sm text-default font-normal mb-10">
                Enter your mobile phone number
              </p>
            ) : (
              <p className="text-sm text-default font-normal mb-10">
                Enter your district provided email and password
              </p>
            )}
          </section>
          <section>
            <form action="" className="space-y-4">
              {mobileOption ? (
                <div>
                  <fieldset className="border-2 border-accent2 rounded">
                    <legend className="text-xs mx-3 px-1">Mobile</legend>
                    <input
                      type="mobile"
                      id="mobile"
                      name="mobile"
                      placeholder="Mobile"
                      value={mobileInputValue}
                      onChange={handleMobileInputChange}
                      className="p-4 focus:outline-none w-full"
                    />
                  </fieldset>
                </div>
              ) : (
                <div>
                  <fieldset className="border-2 border-accent2 rounded">
                    <legend className="text-xs mx-3 px-1">Email</legend>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email"
                      value={emailInputValue}
                      onChange={handleEmailInputChange}
                      className="p-4 focus:outline-none w-full"
                      required
                    />
                  </fieldset>
                  <fieldset className="border-2 border-accent2 rounded mt-4">
                    <legend className="text-xs mx-3 px-1">Password</legend>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Password"
                      value={passwordInputValue}
                      onChange={handlePasswordInputChange}
                      className="p-4 focus:outline-none w-full"
                    />
                  </fieldset>
                </div>
              )}
            </form>
          </section>
          <section className="w-1/2 inline-flex pr-1">
            {mobileOption ? (
              <div className="w-full">
                <button
                  className="my-8 bg-primary px-6 py-3 rounded-3xl text-sm font-medium text-white w-full"
                  type="button"
                  onClick={() => {
                    setMobileOption(!mobileOption);
                    setMobileInputValue("");
                  }}
                >
                  Use Email
                </button>
              </div>
            ) : (
              <div className="w-full">
                {/* <button
                  className="my-8 bg-primary px-6 py-3 rounded-3xl text-sm font-medium text-white w-full"
                  type="button"
                  onClick={() => {
                    setMobileOption(!mobileOption);
                    setEmailInputValue("");
                  }}
                >
                  Use Mobile
                </button> */}
              </div>
            )}
          </section>
          
          <button
            className={`my-8 px-6 py-3 rounded-3xl text-sm font-medium w-full ${
              mobileOption
                ? mobileContinueDisabled
                  ? "bg-accent text-primary text-opacity-40"
                  : "bg-primary text-white"
                : emailContinueDisabled
                ? "bg-accent text-primary text-opacity-40"
                : "bg-primary text-white"
            }`}
            type="button"
            disabled={
              mobileOption ? mobileContinueDisabled : emailContinueDisabled
            }
            onClick={async () => {
              if (mobileOption) {
                const result = await signIn("credentials", {
                  redirect: false, 
                  identifier: mobileInputValue,
                  password: "", 
                });
                if (result?.error) {
                  alert("Login failed: " + result.error);
                } else {
                  window.location.href = "/login-otp-email";
                }
              } else {
                const result = await signIn("credentials", {
                  redirect: false,
                  identifier: emailInputValue,
                  password: passwordInputValue,
                });
                if (result?.error) {
                  alert("Login failed: " + result.error);
                } else {
                  window.location.href = "/login-otp-email";
                }
              }
            }}
          >
            LOG IN
          </button>
          
          <section className="flex flex-col gap-3">
            <a href="#" className="text-sm underline text-link font-normal">
              Need help logging in?
            </a>
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-accent2">
                Don&apos;t have an account?{" "}
              </p>
              <Link href="/sign-up">
                <span className="text-sm underline text-link font-normal">
                  Sign up
                </span>
              </Link>
            </div>
          </section>
        </div>
      )}
    </>
  );
}