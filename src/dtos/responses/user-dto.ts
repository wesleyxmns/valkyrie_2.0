interface AvatarUrls {
    '48x48': string;
    '24x24': string;
    '16x16': string;
    '32x32': string;
}

interface Group {
    name: string;
    self: string;
}

interface Groups {
    size: number;
    items: Group[];
}

type UserData = {
    key: string;
    name: string;
    emailAddress: string;
    avatarUrls: AvatarUrls;
    displayName: string;
    locale: string;
    groups: Groups;
};

export class UserDTO {
    private key: string;
    private name: string;
    private emailAddress: string;
    private avatarUrls: AvatarUrls;
    private displayName: string;
    private locale: string;
    private groups: Groups;

    constructor(user: UserData) {
        this.key = user.key;
        this.name = user.name;
        this.emailAddress = user.emailAddress;
        this.avatarUrls = user.avatarUrls;
        this.displayName = user.displayName;
        this.locale = user.locale;
        this.groups = user.groups
    }

    public getKey(): string {
        return this.key
    }

    public getName(): string {
        return this.name;
    }

    public getEmailAddress(): string {
        return this.emailAddress;
    }

    public getAvatarUrls(): AvatarUrls {
        return this.avatarUrls;
    }

    public getDisplayName(): string {
        return this.displayName;
    }

    public getLocale(): string {
        return this.locale;
    }

    public getGroups(): Groups {
        return this.groups;
    }

    public toJSON() {
        return {
            username: this.name,
            email: this.emailAddress,
            displayName: this.displayName,
            avatarUrl: this.avatarUrls,
        };
    }

    public static fromUser(user: UserData) {
        return new UserDTO(user);
    }
}

