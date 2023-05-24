import fetch from 'node-fetch';

export type AuthInfo = {
    name: string;
    email: string;
    picture: string;
};

export interface AuthProvider {
    authenticate(accessToken: string): Promise<AuthInfo | null>;
}

const googleAuthUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';

type GoogleUserInfo = {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
    locale: string;
    hd: string;
};

export class GoogleAuthProvider implements AuthProvider {
    async authenticate(accessToken: string) {
        const userInfoRes = await fetch(
            `${googleAuthUrl}?access_token=${accessToken}`
        );
        if (!userInfoRes.ok) {
            return null;
        }

        // TODO: get rid of cast to any, this is a horrible way to check if the
        // object has required properties
        const userInfoJson = (await userInfoRes.json()) as {
            name?: string;
            email?: string;
            picture?: string;
        };
        if (
            userInfoJson.name == null ||
            userInfoJson.email == null ||
            userInfoJson.picture == null
        ) {
            return null;
        }

        return userInfoJson as GoogleUserInfo;
    }
}

export class DummyAuthProvider implements AuthProvider {
    async authenticate(accessToken: string) {
        if (accessToken === 'auth') {
            return {
                name: 'Bob Tester',
                email: 'bob.tester@gmail.com',
                picture:
                    'https://yt3.googleusercontent.com/ytc/AGIKgqOnBN9Fze9naSk9bKiMEMwBqFyrxeVhYoVSM1rl=s176-c-k-c0x00ffffff-no-rj',
            };
        } else {
            return null;
        }
    }
}

let provider: AuthProvider = new GoogleAuthProvider();

export function setProvider(p: AuthProvider) {
    provider = p;
}

export function getProvider() {
    return provider;
}
