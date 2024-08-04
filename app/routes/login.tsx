import { useState } from "react";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { json, redirect, createCookieSessionStorage } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";

// Create a session storage
const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "fridge_session",
        secure: process.env.NODE_ENV === "production",
        secrets: ["s3cr3t"], // replace with a real secret
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
    },
});

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const email = formData.get("email");
    const code = formData.get("code");

    if (code) {
        // Verify the code
        const response = await fetch("https://api.justdecision.com/v1/user/extension_login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, token: code }),
        });
        const data = await response.json();

        if (data.success) {
            // Store tokens in session
            const session = await sessionStorage.getSession();
            session.set("openAiToken", data.open_ai_token);
            session.set("teamToken", data.team_token);
            session.set("userEmail", email);

            // Redirect to the main page with the session
            return redirect("/", {
                headers: {
                    "Set-Cookie": await sessionStorage.commitSession(session),
                },
            });
        } else {
            return json({ error: "Invalid code" });
        }
    } else {
        // Send login email
        const response = await fetch("https://api.justdecision.com/v1/user/email_simple_login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        const data = await response.json();

        if (data.success) {
            return json({ emailSent: true });
        } else {
            return json({ error: "Failed to send login email" });
        }
    }
};

// Add a loader to check if the user is already logged in
export const loader: LoaderFunction = async ({ request }) => {
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    if (session.has("openAiToken") && session.has("teamToken")) {
        // User is already logged in, redirect to the main page
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