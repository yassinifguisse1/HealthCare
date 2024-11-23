"use client";
import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import logoImage from "@/assets/images/logosaas.png";
import doctor from "@/assets/images/doctor.jpg";
import Image from "next/image";
import { Suspense } from "react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-card shadow-lg rounded-lg overflow-hidden">
        <Suspense fallback={<p>Loading...</p>}>
            <SignUp.Root>
              <Clerk.Loading>
                {(isGlobalLoading) => (
                  <>
                    <SignUp.Step name="start">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                        <Card className="w-full ">
                        <CardHeader className="flex flex-col items-center justify-center gap-2">
                          <div className="relative">
                            <div className="absolute w-full top-2 bottom-0 bg-[linear-gradient(to_right,#F87BFF,#FB92CF,#FFDD9B,#C2F0B1,#2FD8FE)] blur-md"></div>
                            <Image
                              src={logoImage}
                              alt="Picture of the author"
                              className="size-10 relative"
                            />
                          </div>
                          <CardTitle>Create your account</CardTitle>
                          <CardDescription>
                            Welcome! Please fill in the details to get started.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-y-4">
                          <div className="grid grid-cols-1 gap-x-4">
                            <Clerk.Connection name="google" asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                type="button"
                                disabled={isGlobalLoading}
                              >
                                <Clerk.Loading scope="provider:google">
                                  {(isLoading) =>
                                    isLoading ? (
                                      <Icons.spinner className="size-4 animate-spin" />
                                    ) : (
                                      <>
                                        <Icons.google className="mr-2 size-4" />
                                        Google
                                      </>
                                    )
                                  }
                                </Clerk.Loading>
                              </Button>
                            </Clerk.Connection>
                          </div>
                          <p className="flex items-center gap-x-3 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
                            or
                          </p>
                          <Clerk.Field
                            name="emailAddress"
                            className="space-y-2"
                          >
                            <Clerk.Label asChild>
                              <Label>Email address</Label>
                            </Clerk.Label>
                            <Clerk.Input type="email" required asChild>
                              <Input />
                            </Clerk.Input>
                            <Clerk.FieldError className="block text-sm text-destructive" />
                          </Clerk.Field>
                          <Clerk.Field name="password" className="space-y-2">
                            <Clerk.Label asChild>
                              <Label>Password</Label>
                            </Clerk.Label>
                            <Clerk.Input type="password" required asChild>
                              <Input />
                            </Clerk.Input>
                            <Clerk.FieldError className="block text-sm text-destructive" />
                          </Clerk.Field>
                        </CardContent>
                        <CardFooter>
                          <div className="grid w-full gap-y-4">
                            <SignUp.Captcha className="empty:hidden" />
                            <SignUp.Action submit asChild>
                              <Button disabled={isGlobalLoading}>
                                <Clerk.Loading>
                                  {(isLoading) => {
                                    return isLoading ? (
                                      <Icons.spinner className="size-4 animate-spin" />
                                    ) : (
                                      "Continue"
                                    );
                                  }}
                                </Clerk.Loading>
                              </Button>
                            </SignUp.Action>
                            <Button variant="link" size="sm" asChild>
                              <Clerk.Link navigate="sign-in">
                                Already have an account? Sign in
                              </Clerk.Link>
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                      <div className="hidden md:block relative h-full min-h-[400px]">
                        <Image
                          src={doctor}
                          fill
                          alt={"dd"}
                          className="object-cover"
                        />
                      </div>
                        </div>
                     
                    </SignUp.Step>

                    <SignUp.Step name="continue">
                      <Card className="w-full sm:w-96">
                        <CardHeader>
                          <CardTitle>Continue registration</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Clerk.Field name="username" className="space-y-2">
                            <Clerk.Label>
                              <Label>Username</Label>
                            </Clerk.Label>
                            <Clerk.Input type="text" required asChild>
                              <Input />
                            </Clerk.Input>
                            <Clerk.FieldError className="block text-sm text-destructive" />
                          </Clerk.Field>
                        </CardContent>
                        <CardFooter>
                          <div className="grid w-full gap-y-4">
                            <SignUp.Action submit asChild>
                              <Button disabled={isGlobalLoading}>
                                <Clerk.Loading>
                                  {(isLoading) => {
                                    return isLoading ? (
                                      <Icons.spinner className="size-4 animate-spin" />
                                    ) : (
                                      "Continue"
                                    );
                                  }}
                                </Clerk.Loading>
                              </Button>
                            </SignUp.Action>
                          </div>
                        </CardFooter>
                      </Card>
                    </SignUp.Step>

                    <SignUp.Step name="verifications">
                      <SignUp.Strategy name="email_code">
                        <Card className="w-full sm:w-96">
                          <CardHeader>
                            <CardTitle>Verify your email</CardTitle>
                            <CardDescription>
                              Use the verification link sent to your email
                              address
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="grid gap-y-4">
                            <div className="grid items-center justify-center gap-y-2">
                              <Clerk.Field name="code" className="space-y-2">
                                <Clerk.Label className="sr-only">
                                  Email address
                                </Clerk.Label>
                                <div className="flex justify-center text-center">
                                  <Clerk.Input
                                    type="otp"
                                    className="flex justify-center has-[:disabled]:opacity-50"
                                    autoSubmit
                                    render={({ value, status }) => {
                                      return (
                                        <div
                                          data-status={status}
                                          className={cn(
                                            "relative flex size-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
                                            {
                                              "z-10 ring-2 ring-ring ring-offset-background":
                                                status === "cursor" ||
                                                status === "selected",
                                            }
                                          )}
                                        >
                                          {value}
                                          {status === "cursor" && (
                                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                              <div className="animate-caret-blink h-4 w-px bg-foreground duration-1000" />
                                            </div>
                                          )}
                                        </div>
                                      );
                                    }}
                                  />
                                </div>
                                <Clerk.FieldError className="block text-center text-sm text-destructive" />
                              </Clerk.Field>
                              <SignUp.Action
                                asChild
                                resend
                                className="text-muted-foreground"
                                fallback={({ resendableAfter }) => (
                                  <Button variant="link" size="sm" disabled>
                                    Didn&apos;t receive a code? Resend (
                                    <span className="tabular-nums">
                                      {resendableAfter}
                                    </span>
                                    )
                                  </Button>
                                )}
                              >
                                <Button type="button" variant="link" size="sm">
                                  Didn&apos;t receive a code? Resend
                                </Button>
                              </SignUp.Action>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <div className="grid w-full gap-y-4">
                              <SignUp.Action submit asChild>
                                <Button disabled={isGlobalLoading}>
                                  <Clerk.Loading>
                                    {(isLoading) => {
                                      return isLoading ? (
                                        <Icons.spinner className="size-4 animate-spin" />
                                      ) : (
                                        "Continue"
                                      );
                                    }}
                                  </Clerk.Loading>
                                </Button>
                              </SignUp.Action>
                            </div>
                          </CardFooter>
                        </Card>
                      </SignUp.Strategy>
                    </SignUp.Step>
                  </>
                )}
              </Clerk.Loading>
            </SignUp.Root>
            {/* <div className="hidden md:block relative h-full min-h-[400px]">
              <Image src={doctor} fill alt={"dd"} className="object-cover" />
            </div> */}
        </Suspense>
      </div>
    </div>
  );
}
