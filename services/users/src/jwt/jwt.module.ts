import { Module } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { JwtService } from './jwt.service';


@Module({
  exports:[JwtStrategy,JwtService], //TODO fix all jwt 
  providers: [ JwtService, JwtStrategy],
  //imports: [JwtStrategy,JwtService]
})
export class JwtModule {}
