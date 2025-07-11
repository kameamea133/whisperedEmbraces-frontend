"use client";;
import * as React from "react";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const CookieConsent = React.forwardRef((
  {
    variant = "default",
    demo = false,
    onAcceptCallback = () => {},
    onDeclineCallback = () => {},
    className,
    description = "We use cookies to ensure you get the best experience on our website. For more information on how we use cookies, please see our cookie policy.",
    learnMoreHref = "#",
    ...props
  },
  ref,
) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hide, setHide] = React.useState(false);

  const handleAccept = React.useCallback(() => {
    setIsOpen(false);
    document.cookie =
      "cookieConsent=true; expires=Fri, 31 Dec 9999 23:59:59 GMT";
    setTimeout(() => {
      setHide(true);
    }, 700);
    onAcceptCallback();
  }, [onAcceptCallback]);

  const handleDecline = React.useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setHide(true);
    }, 700);
    onDeclineCallback();
  }, [onDeclineCallback]);

  React.useEffect(() => {
    try {
      setIsOpen(true);
      if (document.cookie.includes("cookieConsent=true") && !demo) {
        setIsOpen(false);
        setTimeout(() => {
          setHide(true);
        }, 700);
      }
    } catch (error) {
      console.warn("Cookie consent error:", error);
    }
  }, [demo]);

  if (hide) return null;

  const containerClasses = cn(
    "fixed z-50 transition-all duration-700",
    !isOpen ? "translate-y-full opacity-0" : "translate-y-0 opacity-100",
    className
  );

  const commonWrapperProps = {
    ref,
    className: cn(containerClasses, variant === "mini"
      ? "left-0 right-0 sm:left-4 bottom-4 w-full sm:max-w-3xl"
      : "bottom-0 left-0 right-0 sm:left-4 sm:bottom-4 w-full sm:max-w-md"),
    ...props,
  };

  if (variant === "default") {
    return (
      <div {...commonWrapperProps}>
        <Card className="m-3 shadow-lg bg-[#2B373B] border-[#4e503b]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg text-white">Cookies</CardTitle>
            <Cookie className="h-5 w-5 text-[#C8C4B9]" />
          </CardHeader>
          <CardContent className="space-y-2 pb-4">
            <CardDescription className="text-sm text-gray-200">
              {description}
            </CardDescription>
            <p className="text-xs text-gray-300">
              En cliquant <span className="font-medium">&quot;Accepter&quot;</span>, vous
              acceptez notre utilisation des cookies.
            </p>
            <a
              href={learnMoreHref}
              className="text-xs text-[#C8C4B9] underline underline-offset-4 hover:no-underline">
              En savoir plus
            </a>
          </CardContent>
          <CardFooter className="flex gap-3 pt-0 pb-4 px-6">
            <Button 
              onClick={handleDecline} 
              variant="outline" 
              className="flex-1 bg-white hover:bg-gray-100 text-black border-gray-300 font-medium"
            >
              Refuser
            </Button>
            <Button 
              onClick={handleAccept} 
              className="flex-1 bg-black hover:bg-gray-800 text-white font-medium"
            >
              Accepter
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (variant === "small") {
    return (
      <div {...commonWrapperProps}>
        <Card className="m-3 shadow-lg bg-[#2B373B] border-[#4e503b] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
            <CardTitle className="text-base text-white">Cookies</CardTitle>
            <Cookie className="h-4 w-4 text-[#C8C4B9]" />
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <CardDescription className="text-sm text-gray-200">
              {description}
            </CardDescription>
          </CardContent>
          <CardFooter className="flex gap-2 px-4 pb-4 pt-0">
            <Button
              onClick={handleDecline}
              variant="outline"
              size="sm"
              className="flex-1 bg-white hover:bg-gray-100 text-black border-gray-300 font-medium text-xs h-8"
            >
              Refuser
            </Button>
            <Button 
              onClick={handleAccept} 
              size="sm" 
              className="flex-1 bg-black hover:bg-gray-800 text-white font-medium text-xs h-8"
            >
              Accepter
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (variant === "mini") {
    return (
      <div {...commonWrapperProps}>
        <Card className="mx-3 shadow-lg bg-[#2B373B] border-[#4e503b] overflow-hidden">
          <CardContent className="flex flex-col sm:flex-row gap-4 p-4">
            <CardDescription className="text-xs sm:text-sm flex-1 text-gray-200">
              {description}
            </CardDescription>
            <div className="flex items-center gap-2 justify-center sm:justify-end flex-shrink-0">
              <Button
                onClick={handleDecline}
                size="sm"
                variant="outline"
                className="bg-white hover:bg-gray-100 text-black border-gray-300 font-medium text-xs h-7 px-3"
              >
                Refuser
              </Button>
              <Button 
                onClick={handleAccept} 
                size="sm" 
                className="bg-black hover:bg-gray-800 text-white font-medium text-xs h-7 px-3"
              >
                Accepter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
});

CookieConsent.displayName = "CookieConsent";
export { CookieConsent };
export default CookieConsent;
