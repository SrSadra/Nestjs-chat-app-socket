import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectedUserModel } from 'src/models/connected-user.model';
import { ConnectedUserService } from './connected-user.service';

@Module({
    imports : [TypeOrmModule.forFeature([ConnectedUserModel])],
    providers: [ConnectedUserService],
    exports : [ConnectedUserService]
})
export class ConnectedUserModule {}
