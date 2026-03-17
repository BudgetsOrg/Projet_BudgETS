
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Objectif } from 'src/entities';
import { Repository } from 'typeorm';


@Injectable()
export class ObjectifService {
    constructor(@InjectRepository(Objectif ) private objectifRepository: Repository<Objectif>) {}


}
