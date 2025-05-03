export const generateOtp = () =>{
    const otp = Math.floor(10000 + Math.random()*900000).toString();
    const expiresAt  = new Date(Date.now()+5 *60*1000);//5 minute
    return { otp, expiresAt}
}