import Mailgen from "mailgen";

const mailgen = new Mailgen({
    theme: "default",
    product: {
    name: "SafeKey",
    link: "https://safekey.app",
},
});

export const otpEmailTemplate = (otp: string) => {
return mailgen.generate({
body: {
    greeting: "Hey",
    intro: "Your SafeKey verification code is:",
    action: {
    instructions: `Use the OTP below to continue. It expires in 5 minutes.`,
    button: {
        color: "#de136fff",
        text: otp,
        link: "#",
    },
    },
    outro: "If you didn’t request this, you can safely ignore this email.",

},
});
};
