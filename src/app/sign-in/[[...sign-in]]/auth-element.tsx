"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SignIn, SignUp } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import { dark } from "@clerk/themes";

const AuthElement = () => {
  const [login, setLogin] = useState<string>("default");

  return (
    <>
      {login === "default" && (
        <div className="flex flex-col space-y-2">
          <Button variant="signInCreme" onClick={() => setLogin("up")}>
            Sign Up
          </Button>
          <Button variant="signInRed" onClick={() => setLogin("in")}>
            Sign In
          </Button>
        </div>
      )}
      {login === "in" && (
        <div>
          <Button variant="red" onClick={() => setLogin("default")}>
            <ArrowLeft />
            Go Back
          </Button>
          <SignIn
            appearance={{
              baseTheme: dark,
            }}
          />
        </div>
      )}
      {login === "up" && (
        <div>
          <Button onClick={() => setLogin("default")}>
            <ArrowLeft />
            Go Back
          </Button>
          <SignUp
            appearance={{
              baseTheme: dark,
            }}
          />
        </div>
      )}
    </>
  );
};

export default AuthElement;
