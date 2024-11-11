'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COOKIES } from '@/config/constants/cookies';
import { ROUTES_VARIABLES } from "@/config/constants/route-variables";
import { validateUserJira } from "@/shared/functions/valid-user-jira";
import RecoveryPassTemplate from "@/templates/auth/recovery-pass-template";
import { render } from '@react-email/render';
import Link from "next/link";
import { setCookie } from "nookies";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { MdOutlineArrowBack } from "react-icons/md";
import { RiMailSendLine } from "react-icons/ri";
import { toast } from "sonner";

interface RecoveryProps {
  user: string;
}

export default function ForgotPassword() {

  const [emailSent, setEmailSent] = useState<boolean>(false)

  const { handleSubmit, register } = useForm()

  const sendRecoveryPasswordEmail = async ({ user }: RecoveryProps) => {
    const URL = `${process.env.NEXT_PUBLIC_BRYNHILDR_API}:${process.env.NEXT_PUBLIC_BRYNHILDR_API_PORT}/v1/mail/send`

    if (!user) {
      toast.warning('Insira seu usuário Jira para receber o link de redefinição');
      return;
    }

    if (!validateUserJira(user)) {
      toast.warning('Usuário Jira se encontra no formato incorreto');
      return;
    }

    const toEmail = `${user}${SB_EMAIL}`
    const magicLink = buildMagicLink(user)
    const template = render(<RecoveryPassTemplate name={formatName(user)} href={magicLink} />)

    const body = {
      name: formatName(user),
      to: toEmail,
      subject: 'Redefinição de senha - Jira',
      body: template
    }

    const result = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body)
    })

    setEmailSent(true)

    return result;
  }

  return (
    <div className="flex justify-center items-center h-screen p-6 relative">
      <Card className="flex flex-col justify-center items-start p-3 max-w-[35rem] w-full bg-LoginBackground">
        <CardHeader className="items-start">
          <CardTitle className="text-3xl font-bold">Esqueci minha senha</CardTitle>
          <CardDescription className="text-gray-500">
            Digite seu endereço de e-mail e enviaremos um link para redefinir sua senha
          </CardDescription>
        </CardHeader>

        <CardContent className="flex gap-4" >
          <form
            onSubmit={handleSubmit(sendRecoveryPasswordEmail as SubmitHandler<FieldValues>)}
            className='flex flex-col items-start gap-3'
          >
            <Label className="" htmlFor="email">
              Email
            </Label>

            <div className="flex items-center" >
              <Input
                {...register('user')}
                className={`
                                device-sm:w-[18rem]
                                device-2xs:w-full
                             `}
                id="email"
                placeholder="jonh.doe"
              />
              <Input
                disabled
                value={SB_EMAIL}
                type="email"
                className="border-none"
              />
            </div>

            {emailSent ? (
              <div className="flex gap-2 items-center">
                <RiMailSendLine className="text-emerald-500" size={20} />
                <span className="text-emerald-500 text-sm">
                  Enviamos um link de redefinição de senha para seu email.
                </span>
              </div>
            ) :
              <Button
                className={`
                             device-sm:w-[rem]
                             device-2xs:w-full
                     `}
                type="submit"
              >
                Recuperar minha senha
              </Button>
            }
          </form>
        </CardContent>

        <Link className="flex gap-1 items-center group" href={ROUTES_VARIABLES.AUTH}>
          <MdOutlineArrowBack className="w-5 transition-transform transform group-hover:-translate-x-1" />
          <span className="text-sm">Voltar para o Login</span>
        </Link>
      </Card>
    </div>
  )
}

const SB_EMAIL = '@sangatiberga.com.br'

function formatName(name: string): string {
  return name.split('.').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function buildMagicLink(username: string): string {
  const token = Buffer.from(`${username}`).toString('base64');
  setCookie(undefined, `${COOKIES.RECOVERY_PASSWORD_TOKEN}`, token, {
    maxAge: 60 * 15
  });
  const magicLink = `${process.env.NEXT_PUBLIC_BRYNHILDR_API}:${process.env.NEXT_PUBLIC_BRYNHILDR_API_PORT}/reset-password/${username}?=${token}`;
  return magicLink;
}