import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities";
import { Repository } from "typeorm";

@Injectable()
export class UserRepository{

    constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>, 
  ) {}

    //Create
    async create(userData: Partial<User>):Promise<User>{
        const newUser = this.repo.create(userData) // .create() prépare l'entité
        return await this.repo.save(newUser)
    }
    // READ (un seul)
    async get(id: number) {
        // Logique findOne
        return await this.repo.findOne({where:{id_user:id}});
    }

    //Methode pour chercher avec email
    async findByEmail(email:string){
        return await this.repo.findOne({where:{ adresse_email: email}});
    }

    // READ (tous)
    async getAll() {
        // Logique findAll
        return await this.repo.find();
    }

    // UPDATE
    async update(id: number, data: Partial<User>) {
        // Logique update
        await this.repo.update(id,data);
        return this.get(id); // retourne lobjet deja mis a jour
    }

    // DELETE
    async delete(id: number) {
    const result = await this.repo.delete(id);
    return result; 
    }

}