'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBrynhildrData } from "@/hooks/brynhildr-data/brynhildr-data";
import { generateUniqueColor } from "@/lib/utils/utils";
import { getInitials } from "@/shared/functions/get-initials";
import { SelectControllerProps } from "@/shared/interfaces/dynamic-form";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Controller } from "react-hook-form";

interface SelectUsersProps extends SelectControllerProps {
    showComponent?: boolean;
    id: string;
    label: string;
    defaultValue?: string;
}

export function SelectUsers({ form, name, value, defaultValue, id, label, disabled, showComponent = true }: SelectUsersProps) {
    const { useGetListAllUsers } = useBrynhildrData()
    const { data: allUsers } = useGetListAllUsers();

    const userColors = useMemo(() => {
        if (!allUsers) return {};
        return allUsers.reduce((acc, user) => {
            acc[user.value] = generateUniqueColor();
            return acc;
        }, {} as Record<string, string>);
    }, [allUsers]);

    const isDefaultAvatar = (avatarUrl: string) => {
        return avatarUrl.includes('avatarId=10122');
    };

    return (
        <Fragment>
            {showComponent && <FloatingLabelInput id={id} label={label}>
                <Fragment>
                    <Controller
                        name={name}
                        defaultValue={defaultValue}
                        control={form.control}
                        render={({ field }) => (
                            <Select
                                disabled={disabled}
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={value ? value : "Selecione"} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {allUsers && allUsers.map((user, idx) => (
                                            <SelectItem key={idx} value={user.value}>
                                                <div className="flex items-center gap-1">
                                                    <Avatar className="w-8 h-8 p-1">
                                                        {!isDefaultAvatar(user.avatar) ? (
                                                            <AvatarImage src={`/api/jira-proxy?url=${encodeURIComponent(user.avatar ?? '')}`} />
                                                        ) : (
                                                            <AvatarFallback style={{ backgroundColor: userColors[user.value], padding: 2 }}>
                                                                {getInitials(user.label)}
                                                            </AvatarFallback>
                                                        )}
                                                    </Avatar>
                                                    {user.label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </Fragment>
            </FloatingLabelInput>}
        </Fragment>
    );
}