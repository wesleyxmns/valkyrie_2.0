'use client'
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { parseCookies } from "nookies";
import { ROUTES_VARIABLES } from "@/config/constants/route-variables";
import ResetPasswordForm from "@/components/features/auth/reset-password-form";

export default function ResetPassword() {

    const router = useRouter();

    useEffect(() => {
        const { '@recovery-password': recoveryPassToken } = parseCookies();

        if (!recoveryPassToken) {
            router.push(`${ROUTES_VARIABLES.EXPIRES_LINK}`);
        }
    }, []);

    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="flex flex-col justify-center items-start p-4 max-w-[25rem] relative bg-LoginBackground">
                <CardHeader className="items-center">
                    <CardTitle className="text-3xl font-bold whitespace-nowrap">
                        Redefina sua senha
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4" >
                    <ResetPasswordForm />
                </CardContent>
            </Card>
        </div>
    )
}