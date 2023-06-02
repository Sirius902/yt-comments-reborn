import fetch from 'node-fetch';

/**
 * User information retrieved through an access token.
 */
export type AuthInfo = {
    name: string;
    email: string;
    picture: string;
};

/**
 * Consumes an access token to authenticate the user.
 */
export interface AuthProvider {
    /**
     * Authenticates a user.
     * @param accessToken an access token specific to the `AuthProvider` type
     * @returns a promise that resolves to either authentication information if
     * authentication was successful and `null` if not.
     */
    authenticate(accessToken: string): Promise<AuthInfo | null>;
}

const googleAuthUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';

/**
 * User information retrieved through a Google OAuth token.
 */
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

/**
 * Authenticates based on Google OAuth tokens.
 */
export class GoogleAuthProvider implements AuthProvider {
    /**
     * Authenticates a user with a Google OAuth token.
     * @param accessToken a Google OAuth token
     * @returns a promise that resolves to either authentication information if
     * authentication was successful and `null` if not.
     */
    async authenticate(accessToken: string) {
        const userInfoRes = await fetch(
            `${googleAuthUrl}?access_token=${accessToken}`
        );
        if (!userInfoRes.ok) {
            return null;
        }

        // Check if the response from the Google authenticator API returned an
        // object with the expected properties.
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
            // Fail to authenticate any of the properties are missing to
            // prevent use of invalid auth tokens.
            return null;
        }

        // The auth token was valid so return the authenticated information.
        return userInfoJson as GoogleUserInfo;
    }
}

/**
 * A dummy auth provider for testing. Should not be used outside of tests.
 */
export class DummyAuthProvider implements AuthProvider {
    /**
     * Authenticates a user if the auth token is `'auth'` and fails if not.
     * @param accessToken
     * @returns a promise that resolves to either authentication information if
     * authentication was successful and `null` if not.
     */
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

/**
 * Change the auth provider used by the server.
 * @param p the auth provide to use
 */
export function setProvider(p: AuthProvider) {
    provider = p;
}

/**
 * Get the current auth provider used by the server.
 * @returns the auth provider
 */
export function getProvider() {
    return provider;
}
