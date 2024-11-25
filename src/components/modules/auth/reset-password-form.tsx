'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES_VARIABLES } from "@/config/constants/route-variables";
import { HttpStatus } from "@/lib/fetch/constants/http-status";
import { brynhildrAPI } from "@/lib/fetch/brynhildr-api";
import { buildJiraAuthorization } from "@/shared/builds/build-jira-authorization";
import { useRouter } from "next/navigation";
import { parseCookies, destroyCookie } from "nookies";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { toast } from "sonner";

interface ResetPassword {
    password: string;
    confirmNewPassword: string;
}

export default function ResetPasswordForm() {

    const router = useRouter()
    const { handleSubmit, register } = useForm();

    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState<boolean>(false);

    const handleToggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };
    const handleToggleConfirmNewPasswordVisibility = () => {
        setShowConfirmNewPassword(!showConfirmNewPassword);
    };


    async function onHandleChangePassword(data: ResetPassword) {
        const { '@recovery-password': token } = parseCookies()
        const username = Buffer.from(token, 'base64').toString('ascii')
        const BASE_URL = `/user/${username}/password`

        if ((data.password && data.confirmNewPassword).length < 6) {
            return toast.warning('Sua senha deve ter no mínimo 6 caracteres')
        }

        if (data.confirmNewPassword !== data.password) {
            return toast.error('As senhas não conferem')
        }

        const result = await brynhildrAPI(BASE_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': buildJiraAuthorization(),
            },
            body: JSON.stringify({ newPassword: data.password })
        })

        if (result.status === HttpStatus.NO_CONTENT) {
            toast.success('Senha alterada com sucesso')
            destroyCookie(undefined, token)
            router.replace(`${ROUTES_VARIABLES.HOME}`)
        }

        return result
    }

    return (
        <form
            onSubmit={handleSubmit(onHandleChangePassword as SubmitHandler<FieldValues>)}
            className='space-y-3 flex flex-col items-start justify-center'
        >
            <Label>Nova Senha</Label>
            <div className="relative" >
                <Input {...register('password')} name="password" type={showNewPassword ? 'text' : 'password'} className="w-[17rem]" />
                <button type="button" className="absolute top-1/2 transform -translate-y-1/2 right-2 focus:outline-none"
                    onClick={handleToggleNewPasswordVisibility}
                >
                    {showNewPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </button>
            </div>

            <Label>Confirme nova senha</Label>
            <div className="relative" >
                <Input {...register('confirmNewPassword')} name="confirmNewPassword" type={showConfirmNewPassword ? 'text' : 'password'} className="w-[17rem]" />
                <button type="button" className="absolute top-1/2 transform -translate-y-1/2 right-2 focus:outline-none"
                    onClick={handleToggleConfirmNewPasswordVisibility}
                >
                    {showConfirmNewPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </button>
            </div>

            <Button
                className={`
                  device-sm:w-[20rem]
                  device-2xs:w-full
                `}
                type="submit"
            >
                Redefinir senha
            </Button>
        </form>
    )
}