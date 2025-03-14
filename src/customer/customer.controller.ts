import { Body, Controller, Get, Param, Patch, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { registration } from './registration entity';
import { Response } from 'express';  // ✅ Import from Express, not NestJS

@Controller('customer')
export class CustomerController {
  
  constructor(private readonly customerService: CustomerService) {}

// ✅ Redirect user to Next.js frontend reset page
@Get('reset-password/:token')
async resetPasswordPage(@Param('token') token: string, @Res() res: Response) {
  return res.redirect(`http://localhost:3001/customer/login/reset-password?token=${token}`);
}


  // Add customer
  @Post('/add')
  async addcustomer(@Body() data: registration) {
    return await this.customerService.addcustomer(data);
  }

 
 // Login customer
 @Post('/login')
 async login(@Body() credentials: { email: string; password: string }) {
   const result = await this.customerService.validateUser(credentials.email, credentials.password);
 
   if (!result) {
     throw new UnauthorizedException('Invalid email or password');
   }
 
   // Fetch the user details after successful login
   const user = await this.customerService.getUserDetails(credentials.email);
 
   return {
     message: 'Login successful',
     token: result.token,
     user: {
       name: user.name,  // Return the user's name
       //email: user.email, // Optionally, return email if needed
     },
   };
}



  @Get('/all')
  async getAlldetails() {
    return await this.customerService.getAlldetails();
  }

  // Update profile with token
  @Patch('/update')
  async updateProfile(@Body() updatedData: Partial<registration>, @Req() req: any) {
    const userId = req.user.id; // Extract user ID from the decoded token
    return await this.customerService.updateprofile(userId, updatedData);
  }
// Forgot password endpoint: Send reset link to the email
@Post('/forgot-password')
async forgotPassword(@Body() { email }: { email: string }) {
  return await this.customerService.sendPasswordResetEmail(email);
}

// Reset password endpoint
@Patch('/reset-password/:resetToken')
async resetPassword(
  @Param('resetToken') resetToken: string,
  @Body() { newPassword }: { newPassword: string },
) {
  return await this.customerService.resetPassword(resetToken, newPassword);
}
  


@Get('/profile')
async getProfile(@Req() req: any) {
  const userId = req.user.id; // Extract user ID from decoded token
  return await this.customerService.getUserProfile(userId);
}

}




