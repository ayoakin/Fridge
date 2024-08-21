import { useState } from "react";
import { Form, useNavigation, useSubmit } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { login, sendLoginEmail } from "~/utils/api";
import { useNavigate } from "react-router-dom";

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const intent = formData.get("intent");

    if (intent === "sendEmail") {
        return json({ emailSent: true });
    } else if (intent === "login") {
        return json({ loggedIn: true });
    }

    return json({ error: "Invalid action" });
};

export default function Login() {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    const [error, setError] = useState("");
    const navigation = useNavigation();
    const submit = useSubmit();
    const navigate = useNavigate();

    const isSubmitting = navigation.state === "submitting";

    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await sendLoginEmail(email);
            setEmailSent(true);
            setError("");
            submit({ intent: "sendEmail" }, { method: "post" });
        } catch (err) {
            setError("Failed to send login email");
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, code);
            navigate('/');
        } catch (err) {
            setError("Invalid code");
        }
    };

    return (
        <div>
            <h1>Login</h1>
            {!emailSent ? (
                <Form onSubmit={handleSendEmail}>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send Login Link"}
                    </button>
                </Form>
            ) : (
                <Form onSubmit={handleLogin}>
                    <input
                        type="text"
                        name="code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter verification code"
                        required
                    />
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Verifying..." : "Verify Code"}
                    </button>
                </Form>
            )}
            {error && <p>{error}</p>}
        </div>
    );
}