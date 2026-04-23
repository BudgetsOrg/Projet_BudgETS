import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Budget, User } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class BudgetRepository {
  constructor(
    @InjectRepository(Budget)
    private readonly repo: Repository<Budget>,
  ) {}

  //Create
  async create(solde: number, user: User): Promise<Budget> {
    const newBudget = this.repo.create({
      soldeDuMois: solde,
      user: user,
    }); // .create() prépare l'entité
    return await this.repo.save(newBudget);
  }

  // READ (un seul)
  async get(id: number) {
    // Logique findOne
    return await this.repo.findOne({ where: { id_budget: id } });
  }

  //Methode pour chercher avec email
  async findByEmail(email: string) {
    return await this.repo.findOne({
      where: { user: { adresse_email: email } },
    });
  }

  //Methode pour recuperer les budget d'un utilisateur specifique
  async findByUser(userId: number): Promise<Budget[]> {
    // Logique findAll
    return await this.repo.find({
      where: { user: { id_user: userId } },
      order: { date_creation: 'DESC' },
    });
  }

  // Récupérer le budget actuel (le dernier créé)
  async findLatestByUserId(userId: number): Promise<Budget | null> {
    return await this.repo.findOne({
      where: { user: { id_user: userId } },
      order: { date_creation: 'DESC' },
    });
  }

  // UPDATE (un montant du budget)
  async update(
    userId: number,
    budgetId: number,
    data: Partial<Budget>,
  ): Promise<Budget | null> {
    await this.repo.update(
      { id_budget: budgetId, user: { id_user: userId } },
      data,
    );
    return await this.repo.findOne({ where: { id_budget: budgetId } });
  }

  // DELETE
  async delete(
    userID:number, 
    budgetId:number 
  ){
    return await this.repo.delete({id_budget: budgetId, user: { id_user: userID }})
  }
}
