"use client";
import { GoogleLogin } from '@react-oauth/google';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useEffect, useState } from 'react';

interface AuthResponse {
    credential: string;
    clientId: string;
    select_by: string;
    access_token?: string;
}

interface UserProfile {
    id: string;
    email: string;
    name: string;
}

const GoogleLoginButton = () => {
    const [user, setUser] = useState<AuthResponse | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);

    const googleLogin = useGoogleLogin({
        onSuccess: (authResponse: any) => {
            console.log('authResponse', authResponse)
            setUser(authResponse)
        },
        onError: (error: any) => console.log('Login Failed:', error)
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (user && user.access_token) {
                try {
                    const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    });
                    const data = await response.json();
                    console.log('data', data)
                    setProfile(data);
                } catch (err) {
                    console.log(err);
                }
            }
        };
        fetchProfile();
    }, [user]);

    return (
        <div>
            <h2>React Google Login</h2>
            <br />
            <br />
            <button onClick={() => googleLogin()}>Sign in with Google</button>
        </div>
    );
};

export default GoogleLoginButton;