import { useState } from "react";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { json, redirect, createCookieSessionStorage } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { login, sendLoginEmail } from "~/utils/api";

const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "fridge_session",
        secure: process.env.NODE_ENV === "production",
        secrets: ["s3cr3t"],
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
    },
});

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const code = formData.get("code") as string;

    if (code) {
        try {
            const data = await login(email, code);
            const session = await sessionStorage.getSession();
            session.set("openAiToken", data.open_ai_token);
            session.set("teamToken", data.team_token);
            session.set("userEmail", email);
            return redirect("/", {
                headers: {
                    "Set-Cookie": await sessionStorage.commitSession(session),
                },
            });
        } catch (error) {
            return json({ error: "Invalid code" });
        }
    } else {
        try {
            const data = await sendLoginEmail(email);
            return json({ emailSent: data.success, error: data.success ? null : "Failed to send login email" });
        } catch (error) {
            return json({ error: "Failed to send login email" });
        }
    }
};

export const loader: LoaderFunction = async ({ request }) => {
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    if (session.has("openAiToken") && session.has("teamToken")) {
        return redirect("/");
    }
    return null;
};

export default function Login() {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const actionData = useActionData<typeof action>();
    const navigation = useNavigation();

    const isSubmitting = navigation.state === "submitting";

    return (
        <div>
            <h1>Login</h1>
            <Form method="post">
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                />
                {actionData?.emailSent && (
                    <input
                        type="text"
                        name="code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter verification code"
                        required
                    />
                )}
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                        ? "Submitting..."
                        : actionData?.emailSent
                            ? "Verify Code"
                            : "Send Login Link"}
                </button>
            </Form>
            {actionData?.error && <p>{actionData.error}</p>}
        </div>
    );
}