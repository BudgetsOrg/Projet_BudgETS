import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities";
import { UserService } from "src/user/user.service";

//bibliothèque officielle de NestJS pour gérer les JSON Web Tokens (JWT).
//npm i --save @nestjs/jwt installer


@Injectable()
export class AuthService{
    constructor(
    private readonly userService: UserService, 
    private readonly jwtService: JwtService
  ){}
}