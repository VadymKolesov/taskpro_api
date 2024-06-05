import 'dotenv/config';

const {BASE_URL, APLICATION_EMAIL} = process.env;

const createVerificatinEmail = (email, verificationToken) =>({
    to: email.toLowerCase(),
    from: APLICATION_EMAIL,
    subject: "welcome to contactbook!",
    html: `To verify your email please <a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">click</a> here`,
    text: `To verify your email please open the link ${BASE_URL}/api/users/verify/${verificationToken}`
})

export default createVerificatinEmail;