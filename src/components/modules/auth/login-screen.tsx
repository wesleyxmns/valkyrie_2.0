'use client'
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShinyButton } from "@/components/ui/shiny-button";
import BlurIn from "@/components/ui/text-blur-in";
import { AuthContext } from "@/contexts/auth/auth-context";
import { UserAuthentication } from "@/shared/interfaces/auth";
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineKey, AiOutlineUser } from 'react-icons/ai';
import { LiaExternalLinkAltSolid } from 'react-icons/lia';
import { PiEye, PiEyeClosed } from "react-icons/pi";
import Logo from '../../../../public/assets/images/png/logo-sangati.png';
import ValkyrieLogo from '../../../../public/svg/valkyrie-logo-icon.svg'

export function LoginScreen() {
  const { signIn, keepMeLoggedIn, setKeepMeLoggedIn } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { register, handleSubmit } = useForm()

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function login(autentication: UserAuthentication) {
    await signIn(autentication)
  }

  return (
    <Card className="w-full  h-[600px] max-w-4xl flex overflow-hidden relative bg-LoginBackground border-white border">
      <div className="flex-1 flex w-full justify-center flex-col items-center">
        <CardHeader>
          <CardHeader className='flex items-center justify-center space-y-5'>
            <div className='mb-5'>
              <Image priority className='w-64' src={Logo} alt='Logotipo da aplicação' />
            </div>
          </CardHeader>
        </CardHeader>
        <CardContent className="space-y-4 p-2">
          <form onSubmit={handleSubmit(login as SubmitHandler<FieldValues>)} className='space-y-5 flex flex-col items-center justify-center'>
            <Input
              autoComplete='username'
              {...register('username')}
              name="username"
              icon={AiOutlineUser}
              placeholder="Usuário"
              className="focus:border-indigo-800"
            />
            <div className='relative' >
              <Input autoComplete='password' {...register('password')} name="password" icon={AiOutlineKey} type={showPassword ? 'text' : 'password'} placeholder="Senha" className="focus:border-indigo-800" />
              <button type="button" className="absolute top-1/2 transform -translate-y-1/2 right-2 focus:outline-none"
                onClick={handleTogglePasswordVisibility}
              >
                {showPassword ? <PiEye /> : <PiEyeClosed />}
              </button>
            </div>

            <Button variant='link' asChild>
              <Link href="/forgot-password" className='cursor-pointer font-normal'>
                Esqueceu a senha?
              </Link>
            </Button>

            <div className='flex justify-center items-center gap-2 font-normal' >
              <Checkbox
                checked={keepMeLoggedIn}
                onCheckedChange={(e: boolean) => setKeepMeLoggedIn(e as boolean)}
              />
              <Label className='font-normal'>Mantenha-me conectado</Label>
            </div>

            <ShinyButton >
              Entrar
            </ShinyButton>

            <Link target='_blank' className='text-sm flex gap-1 items-center border-b-[1px] border-slate-600' href="http://srvvmjira.sangatiberga.com.br:8080/" >
              Jira
              <LiaExternalLinkAltSolid />
            </Link>

          </form>
        </CardContent>
      </div>
      <div className="flex-1 justify-center items-center w-full bg-gradient-to-br from-gray-800 via-indigo-800 to-gray-800 hidden md:flex">
        <BlurIn
          content={ValkyrieLogo}
          isImage
          imageWidth={300}
          imageHeight={50}
          className="text-sm font-bold text-white dark:text-white select-none"
        />
      </div>
      <BorderBeam borderWidth={2} size={300} colorFrom="indigo" colorTo="indigo" />
    </Card>
  );
}