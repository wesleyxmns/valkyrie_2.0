'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { JIRA_PROXY_URL } from "@/config/env/jira-proxy-url";
import { useAuth } from "@/hooks/auth/use-auth";
import { jiraGroups } from "@/shared/constants/jira/jira-groups";
import { getInitials } from "@/shared/functions/get-initials";
import { MdOutlineArrowBack } from "react-icons/md";

export function Profile() {
  const { user, signOut } = useAuth();

  const avatarUrl = user && user.getAvatarUrls()[`${48}x${48}`];
  const proxyUrl = `${JIRA_PROXY_URL}${encodeURIComponent(avatarUrl ?? '')}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-9 w-9 cursor-pointer">
          <AvatarImage src={proxyUrl} alt={user?.getDisplayName()} />
          <AvatarFallback>{user?.getDisplayName() && getInitials(user?.getDisplayName())}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-6 w-80 overflow-hidden cursor-pointer rounded-2xl bg-white dark:bg-gray-800">
        <div className="h-24 w-full bg-primary rounded-lg"></div>
        <DropdownMenuItem className="-mt-10 space-y-4 flex flex-col items-center">
          <Avatar className="h-20 w-20 border-4 border-white dark:border-gray-800">
            <AvatarImage src={proxyUrl} alt={user?.getDisplayName()} />
            <AvatarFallback>{user?.getDisplayName() && getInitials(user.getDisplayName())}</AvatarFallback>
          </Avatar>
          <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100">
            {user?.getDisplayName()}
          </h2>
          <Badge className="text-sm">
            {user?.getName()}
          </Badge>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
            {user?.getGroups().items
              .filter(group => Object.values(jiraGroups).includes(group.name))
              .map(group => group.name)
              .join(', ')}
          </p>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="flex gap-1 items-center group cursor-pointer">
          <MdOutlineArrowBack className="w-5 text-red-500 transition-transform transform group-hover:-translate-x-1" />
          <span className="text-sm text-red-500">Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}