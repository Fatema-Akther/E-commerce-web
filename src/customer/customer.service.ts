import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { registration } from './registration entity';
import * as nodemailer from 'nodemailer';



@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(registration)
    private readonly regiRepository: Repository<registration>,
  ) {}

  // Add customer
  async addcustomer(customerData: Partial<registration>) {
    if (!customerData.password) {
      throw new Error('Password is required');
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt();
    customerData.password = await bcrypt.hash(customerData.password, salt);

    const registration = this.regiRepository.create(customerData);
    return await this.regiRepository.save(registration);
  }

  // Get all customer details
  async getAlldetails() {
    return await this.regiRepository.find();
  }

  // Validate user credentials for login
  async validateUser(email: string, password: string): Promise<{ token: string } | null> {
    const user = await this.regiRepository.findOne({ where: { email } });
  
    if (!user) {
      return null; // User not found
    }
  
    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
  
    if (!isPasswordValid) {
      return null; // Password doesn't match
    }
  
    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, 'your-secret-key', { expiresIn: '1h' });
  
    return { token }; // Return the token
  }
  
// Fetch user details by name
async getUserDetails(email: string): Promise<{ name: string; email: string }> {
  const user = await this.regiRepository.findOne({ where: { email } });

  if (!user) {
    throw new Error('User not found');
  }

  return {
    name: user.name, // Fetch and return the name
    email: user.email, // You can also return the email if needed
  };
}

  // Update profile using the decoded token
  async updateprofile(userId: number, updatedData: Partial<registration>) {
    const user = await this.regiRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('Customer not found');
    }

    // Update the user profile
    const updatedUser = this.regiRepository.merge(user, updatedData);
    return await this.regiRepository.save(updatedUser);
  }

// Method to send email for password reset
async sendPasswordResetEmail(email: string) {
  const user = await this.regiRepository.findOne({ where: { email } });

  if (!user) {
    throw new NotFoundException('User with this email does not exist');
  }

  // Generate a reset token
  const resetToken = jwt.sign({ id: user.id }, 'your-secret-key', { expiresIn: '1h' });

  // Save the reset token to the database
  user.resetToken = resetToken;
  await this.regiRepository.save(user);

  // Send the reset token to the user's email
  await this.sendEmail(user.email, resetToken);
}

// Send email with reset token (for the user to reset their password)
private async sendEmail(email: string, resetToken: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use any SMTP service
    auth: {
      user: 'sumafatema10@gmail.com',
      pass: 'zewc omce nlla fmfx',
    },
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Password Reset Request',
    text: `You requested a password reset. Click the link below to reset your password:\n\n
      http://localhost:3000/customer/reset-password/${resetToken}`,
  };

  await transporter.sendMail(mailOptions);
}

async resetPassword(resetToken: string, newPassword: string) {
  try {
    // Explicitly cast the decoded token as JwtPayload
    const decoded = jwt.verify(resetToken, 'your-secret-key') as jwt.JwtPayload;

    // Ensure 'id' exists in the decoded token before using it
    if (!decoded.id) {
      throw new BadRequestException('Invalid token: ID missing');
    }

    const user = await this.regiRepository.findOne({ where: { id: decoded.id } });

    if (!user || user.resetToken !== resetToken) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Hash the new password before saving it
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetToken = null; // Clear the reset token
    await this.regiRepository.save(user);
  } catch (error) {
    throw new BadRequestException('Invalid or expired reset token');
  }
}


//profile
async getUserProfile(userId: number) {
  const user = await this.regiRepository.findOne({ where: { id: userId } });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  return {
 
    name: user.name,
    phonenumber: user.phonenumber,
    email: user.email,
    address: user.address
  };
}


}
  





