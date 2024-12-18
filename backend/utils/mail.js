exports.generateOTP = () => {
     let otp = '' //  Reset OTP to an empty string each time the function is called
     for(let i =0; i<=3; i++){// Loop 4 times to generate a 4-digit OTP
         const randVal =  Math.round(Math.random() * 9) // Generate a random digit between 0 and 9
         otp = otp + randVal // Return the generated OTP
     }
     return otp;
 }