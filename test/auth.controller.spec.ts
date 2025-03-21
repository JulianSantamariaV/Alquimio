// import { Test, TestingModule } from '@nestjs/testing';
// import { AppController } from './jwt/app.controller';
// import { AppService } from './app.service';
// import { PrismaService } from './db';
// import { JwtService } from './jwt/jwt.service';
// import {
//   ConflictException,
//   BadRequestException,
//   UnauthorizedException,
// } from '@nestjs/common';
// import * as bcrypt from 'bcrypt';

// describe('AppController', () => {
//   let appController: AppController;
//   let appService: AppService;
//   let prismaService: PrismaService;
//   let jwtService: JwtService;

//   const mockPrismaService = {
//     users: {
//       findFirst: jest.fn(),
//       create: jest.fn(),
//       findUnique: jest.fn(),
//     },
//   };

//   const mockJwtService = {
//     generateToken: jest.fn(),
//   };

//   beforeEach(async () => {
//     const app: TestingModule = await Test.createTestingModule({
//       controllers: [AppController],
//       providers: [
//         AppService,
//         {
//           provide: PrismaService,
//           useValue: mockPrismaService,
//         },
//         {
//           provide: JwtService,
//           useValue: mockJwtService,
//         },
//       ],
//     }).compile();

//     appController = app.get<AppController>(AppController);
//     appService = app.get<AppService>(AppService);
//     prismaService = app.get<PrismaService>(PrismaService);
//     jwtService = app.get<JwtService>(JwtService);

//     // Clear all mocks before each test
//     jest.clearAllMocks();
//   });

//   describe('AppService - Register', () => {
//     const validUserData = {
//       username: 'testuser',
//       password: 'Password123!',
//       name: 'Test',
//       lastName: 'User',
//       email: 'test@example.com',
//     };

//     const mockToken = 'mock.jwt.token';

//     it('should successfully register a new user', async () => {
//       // Mock the database checks and operations
//       mockPrismaService.users.findFirst.mockResolvedValue(null);
//       mockPrismaService.users.create.mockResolvedValue({
//         ...validUserData,
//         userid: 1,
//         rol: 0,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });
//       mockJwtService.generateToken.mockReturnValue(mockToken);

//       const result = await appService.register(
//         validUserData.username,
//         validUserData.password,
//         validUserData.name,
//         validUserData.lastName,
//         validUserData.email,
//       );

//       expect(result).toEqual({ accessToken: mockToken });
//       expect(mockPrismaService.users.findFirst).toHaveBeenCalledTimes(1);
//       expect(mockPrismaService.users.create).toHaveBeenCalledTimes(1);
//       expect(mockJwtService.generateToken).toHaveBeenCalledTimes(1);
//     });

//     it('should throw BadRequestException for invalid email format', async () => {
//       const invalidEmail = 'invalid-email';

//       await expect(
//         appService.register(
//           validUserData.username,
//           validUserData.password,
//           validUserData.name,
//           validUserData.lastName,
//           invalidEmail,
//         ),
//       ).rejects.toThrow(BadRequestException);
//     });

//     it('should throw BadRequestException for missing required fields', async () => {
//       await expect(
//         appService.register(
//           '',
//           validUserData.password,
//           validUserData.name,
//           validUserData.lastName,
//           validUserData.email,
//         ),
//       ).rejects.toThrow(BadRequestException);
//     });

//     it('should throw ConflictException for existing email', async () => {
//       mockPrismaService.users.findFirst.mockResolvedValue({
//         ...validUserData,
//         userid: 1,
//       });

//       await expect(
//         appService.register(
//           validUserData.username,
//           validUserData.password,
//           validUserData.name,
//           validUserData.lastName,
//           validUserData.email,
//         ),
//       ).rejects.toThrow(ConflictException);
//     });

//     it('should throw ConflictException for existing username', async () => {
//       mockPrismaService.users.findFirst.mockResolvedValue({
//         ...validUserData,
//         email: 'different@example.com',
//         userid: 1,
//       });

//       await expect(
//         appService.register(
//           validUserData.username,
//           validUserData.password,
//           validUserData.name,
//           validUserData.lastName,
//           'newemail@example.com',
//         ),
//       ).rejects.toThrow(ConflictException);
//     });

//     it('should hash the password before saving', async () => {
//       mockPrismaService.users.findFirst.mockResolvedValue(null);
//       mockPrismaService.users.create.mockResolvedValue({
//         ...validUserData,
//         userid: 1,
//         rol: 0,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });
//       mockJwtService.generateToken.mockReturnValue(mockToken);

//       await appService.register(
//         validUserData.username,
//         validUserData.password,
//         validUserData.name,
//         validUserData.lastName,
//         validUserData.email,
//       );

//       const createCall = mockPrismaService.users.create.mock.calls[0][0];
//       expect(createCall.data.password).not.toBe(validUserData.password);
//       expect(createCall.data.password).toMatch(/^\$2[aby]\$\d+\$/); // Check for bcrypt hash format
//     });
//   });
// });
// describe('AppService - Login', () => {
//   let appService: AppService;
//   let prismaService: PrismaService;
//   let jwtService: JwtService;

//   const mockPrismaService = {
//     users: {
//       findUnique: jest.fn(),
//     },
//   };

//   const mockJwtService = {
//     generateToken: jest.fn(),
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         AppService,
//         {
//           provide: PrismaService,
//           useValue: mockPrismaService,
//         },
//         {
//           provide: JwtService,
//           useValue: mockJwtService,
//         },
//       ],
//     }).compile();

//     appService = module.get<AppService>(AppService);
//     prismaService = module.get<PrismaService>(PrismaService);
//     jwtService = module.get<JwtService>(JwtService);

//     // Clear all mocks before each test
//     jest.clearAllMocks();
//   });

//   const mockUser = {
//     userid: 1,
//     email: 'test@example.com',
//     password: '$2b$10$yourhashhere', // bcrypt hashed password
//     rol: 0,
//   };

//   const mockToken = 'mock.jwt.token';

//   describe('login', () => {
//     it('should successfully login with valid credentials', async () => {
//       // Mock successful user lookup
//       mockPrismaService.users.findUnique.mockResolvedValue(mockUser);
//       // Mock successful password comparison
//       jest
//         .spyOn(bcrypt, 'compare')
//         .mockImplementation(() => Promise.resolve(true));
//       // Mock token generation
//       mockJwtService.generateToken.mockReturnValue(mockToken);

//       const result = await appService.login(
//         'test@example.com',
//         'correctPassword',
//       );

//       expect(result).toEqual({ accessToken: mockToken });
//       expect(mockPrismaService.users.findUnique).toHaveBeenCalledWith({
//         where: { email: 'test@example.com' },
//       });
//       expect(mockJwtService.generateToken).toHaveBeenCalledWith(
//         mockUser.userid,
//         mockUser.email,
//         mockUser.rol,
//       );
//     });

//     it('should throw BadRequestException for missing email', async () => {
//       await expect(appService.login('', 'password')).rejects.toThrow(
//         BadRequestException,
//       );
//     });

//     it('should throw BadRequestException for missing password', async () => {
//       await expect(appService.login('test@example.com', '')).rejects.toThrow(
//         BadRequestException,
//       );
//     });

//     it('should throw BadRequestException for invalid email format', async () => {
//       await expect(
//         appService.login('invalid-email', 'password'),
//       ).rejects.toThrow(BadRequestException);
//     });

//     it('should throw UnauthorizedException for non-existent user', async () => {
//       mockPrismaService.users.findUnique.mockResolvedValue(null);

//       await expect(
//         appService.login('nonexistent@example.com', 'password'),
//       ).rejects.toThrow(UnauthorizedException);
//     });

//     it('should throw UnauthorizedException for invalid password', async () => {
//       mockPrismaService.users.findUnique.mockResolvedValue(mockUser);
//       jest
//         .spyOn(bcrypt, 'compare')
//         .mockImplementation(() => Promise.resolve(false));

//       await expect(
//         appService.login('test@example.com', 'wrongPassword'),
//       ).rejects.toThrow(UnauthorizedException);
//     });

//     it('should handle database errors gracefully', async () => {
//       mockPrismaService.users.findUnique.mockRejectedValue(
//         new Error('DB Error'),
//       );

//       await expect(
//         appService.login('test@example.com', 'password'),
//       ).rejects.toThrow('Login failed');
//     });
//   });
// });
